import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigate.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-iframe-medi',
  templateUrl: './iframe-medi.page.html',
  styleUrls: ['./iframe-medi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IframeMediPage implements OnInit {
  link: SafeResourceUrl = '';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const rawLink = params['link'];
      if (rawLink) {
        this.loadingService.show(); 
        this.link = this.sanitizer.bypassSecurityTrustResourceUrl(rawLink);
      }
    });
  }

  onIframeLoad() {
    this.loadingService.hide(); 
  }

  voltar() {
    this.navigationService.back();
  }
}
