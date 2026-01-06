import { Component, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';

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
export class AdminPage implements OnInit {
  icons = {
    calendar,
    people
  };
  isMaster = false;
  isAdmin = false;
  isMinistry = false;

  constructor(
    private router: Router, 
    private navigationService: NavigationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User role:', user.role);
        this.isMaster = user.role === 'Admin'; 
        this.isAdmin = user.role === 'Admin' || user.role === 'master';;
        this.isMinistry = user.role === 'ministry' || user.role === 'Admin' || user.role === 'master';
      }
    });
  }

  navegar(rota: string) {
    this.router.navigateByUrl(rota);
  }

  voltar() {
    this.navigationService.back();
  }
}
