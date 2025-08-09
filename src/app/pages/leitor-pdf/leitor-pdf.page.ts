import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/services/navigate.service';
import { GestureController, Gesture } from '@ionic/angular';


@Component({
  selector: 'app-livro-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, IonicModule],
  templateUrl: './leitor-pdf.page.html',
  styleUrls: ['./leitor-pdf.page.scss']
})
export class LeitorPdfComponent {
  pdfSrc: string = '';
  currentPage = 1;
  totalPages = 0;
  pdfZoom: number = 0.72;
  private pdfInstance: any;

  constructor(
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private gestureCtrl: GestureController
  ) {
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfSrc = params['pdf'];
    });
    this.setResponsiveZoom();
    window.addEventListener('resize', () => this.setResponsiveZoom());
  }

  private setResponsiveZoom() {
    const containerWidth = window.innerWidth; 
    const baseWidth = 680;
    this.pdfZoom = containerWidth / baseWidth;
  }


  ionViewWillEnter() {
    this.initSwipeGesture();

    this.currentPage = parseInt(localStorage.getItem(`pdf-page-${this.pdfSrc}`) || '1')
    if (this.pdfInstance) {
    }
  }

  private initSwipeGesture() {
    const content = document.querySelector('ion-content');

    if (!content) return;

    const gesture: Gesture = this.gestureCtrl.create({
      el: content,
      gestureName: 'swipe-pdf',
      onMove: ev => {
        // Sensibilidade do gesto (pode ajustar)
        if (Math.abs(ev.deltaX) > 50) {
          if (ev.deltaX < 0) {
            this.nextPage();  // deslizou para a esquerda
          } else {
            this.prevPage();  // deslizou para a direita
          }
        }
      }
    });

    gesture.enable();
  }

  onPdfLoad(pdf: any) {
    this.pdfInstance = pdf;
    this.totalPages = pdf.numPages;

    const savedPage = localStorage.getItem(`pdf-page-${this.pdfSrc}`);
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;

  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.savePage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.savePage();
    }
  }

  private savePage() {
    if (this.pdfSrc) {
      localStorage.setItem(`pdf-page-${this.pdfSrc}`, this.currentPage.toString());
    }
  }


  voltar() {
    this.navigationService.back();
  }
}
