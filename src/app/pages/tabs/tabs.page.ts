import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonTabBar,
  IonTabs,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [ 
    IonTabBar,
    IonTabs,
    IonTabButton,
    IonLabel, 
    CommonModule, 
    FormsModule,
    IonIcon
  ]
})
export class TabsPage {
  role: string | null = null;
  isAdmin = false;
  proximosEventos: any[] = [];

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.authService.user$.subscribe(async user => {
      if (user) {
        this.role = user.role || null;
        this.isAdmin = this.role === 'Admin';
        await this.carregarProximosEventos(user.uid);
      }
    });

  }


  async carregarProximosEventos(uid: string) {
      this.scheduleService.listarSchedules().subscribe((data) => {
        const todosEventos = data
  
        const agora = moment();
        const futuros = todosEventos.filter((e: any) => moment(e.dataHora).isSameOrAfter(agora));
  
        futuros.sort((a: any, b: any) => moment(a.dataHora).diff(moment(b.dataHora)));
  
        this.proximosEventos = futuros.slice(0, 3);
      })
    }
}
