import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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

  constructor(private router: Router, private location: Location) { }

  navegar(rota: string) {
    this.router.navigateByUrl(rota);
  }

  voltar() {
    this.location.back();
  }
}
