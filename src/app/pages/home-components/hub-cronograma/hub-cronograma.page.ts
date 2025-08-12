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
  selector: 'app-hub-cronograma',
  templateUrl: './hub-cronograma.page.html',
  styleUrls: ['./hub-cronograma.page.scss'],
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
})
export class HubCronogramaPage  {

  constructor(private router: Router, private navigationService: NavigationService) { }

  navegar(rota: string) {
    this.router.navigateByUrl(rota);
  }

  voltar() {
    this.navigationService.back();
  }
}
