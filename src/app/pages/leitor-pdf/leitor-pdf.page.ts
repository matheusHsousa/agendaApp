import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/services/navigate.service';
import { GestureController, Gesture } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service'; // importar o serviço

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
  @ViewChild('pdfContainer', { static: true }) pdfContainer!: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private gestureCtrl: GestureController,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfSrc = params['pdf'];
      if (this.pdfSrc) {
        this.loadingService.show();
      }
    });

    this.setResponsiveZoom();
    window.addEventListener('resize', () => this.setResponsiveZoom());
  }

  ngAfterViewInit() {
    const gesture: Gesture = this.gestureCtrl.create({
      el: this.pdfContainer.nativeElement,
      gestureName: 'swipe-pdf',
      onMove: ev => {
      },
      onEnd: ev => {
        const swipeThreshold = 50;
        if (ev.deltaX > swipeThreshold) {
          this.prevPage();
        } else if (ev.deltaX < -swipeThreshold) {
          this.nextPage();
        }
      }
    });
    gesture.enable(true);
  }


  private setResponsiveZoom() {
    const containerWidth = window.innerWidth;
    const baseWidth = 680;
    this.pdfZoom = containerWidth / baseWidth;
  }

  ionViewWillEnter() {
    this.currentPage = parseInt(localStorage.getItem(`pdf-page-${this.pdfSrc}`) || '1');
  }


  onPdfLoad(pdf: any) {
    this.pdfInstance = pdf;
    this.totalPages = pdf.numPages;

    const savedPage = localStorage.getItem(`pdf-page-${this.pdfSrc}`);
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;

    this.loadingService.hide();
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
