import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,

} from '@ionic/angular/standalone';

import { calendar, people } from 'ionicons/icons';
import { NavigationService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  icons = {
    calendar,
    people
  };

  constructor(private router: Router, private navigationService: NavigationService) { }

  navegar(rota: string) {
    this.router.navigateByUrl(rota);
  }

  voltar() {
    this.navigationService.back();
  }
}
