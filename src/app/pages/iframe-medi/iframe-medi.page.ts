import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


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
    private location: Location,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const rawLink = params['link'];
      if (rawLink) {
        this.link = this.sanitizer.bypassSecurityTrustResourceUrl(rawLink);
      }
    });
  }

  voltar() {
    this.location.back();
  }
}
