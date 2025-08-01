import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import moment from 'moment';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonContent,
  IonAvatar
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/userInfo.service';
import { getTimes } from 'suncalc';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonContent,
    IonAvatar
  ],
})
export class HomePage {
  role: string | null = null;
  isAdmin = false;
  proximosEventos: any[] = [];
  user: any;
  sunsetTime: string | null = null;

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private router: Router,
    private usersInfoService: UserService
  ) {
    this.authService.user$.subscribe(async user => {
      if (user) {
        this.role = user.role || null;
        this.isAdmin = this.role === 'Admin';
        await this.carregarProximosEventos(user.uid);
      }
    });

  }

  async ngOnInit() {
    this.user = await this.usersInfoService.getUser();

    // 1. Mostra inicialmente o horário de SP (fallback imediato)
    this.definirHorarioPorDoSol(-23.55052, -46.633308); // São Paulo

    // 2. Depois tenta pegar localização real e atualizar
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.definirHorarioPorDoSol(lat, lon); // substitui com localização real
        },
        (error) => {
          console.warn('Erro ao obter localização. Mantendo horário de SP.', error);
        }
      );
    } else {
      console.warn('Geolocalização não suportada. Mantendo horário de SP.');
    }
  }

  definirHorarioPorDoSol(lat: number, lon: number) {
    const times = getTimes(new Date(), lat, lon);
    this.sunsetTime = times.sunset.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }



  goToAdmin() {
    this.router.navigate(['tabs/admin']);
  }

  goToUserSchedule() {
    this.router.navigate(['tabs/user-schedule'])
  }

  goToSabbathSchool() {
    this.router.navigate(['tabs/sabbath-school'])

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

  formatarData(dataHora: string) {
    return moment(dataHora).format('dddd, DD/MM/YY');
  }

  formatarDia(dataHora: string) {
    return moment(dataHora).locale('pt-br').format('dddd, DD/MM');
  }

  formatarHora(dataHora: string) {
    return moment(dataHora).format('HH:mm');
  }

}
