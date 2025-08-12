import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
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

import { registerPlugin } from '@capacitor/core';

interface OpenPixPlugin {
  open(options: { code: string }): Promise<void>;
}

const OpenPix = registerPlugin<OpenPixPlugin>('OpenPix');

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

export class HomePage implements AfterViewInit {
  role: string | null = null;
  isAdmin = false;
  proximosEventos: any[] = [];
  user: any;
  sunsetTime: string | null = null;

  @ViewChildren('animado', { read: ElementRef })
  elementosAnimaveis!: QueryList<ElementRef>;

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
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    this.notifySum();

    this.definirHorarioPorDoSol(-23.55052, -46.633308);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.definirHorarioPorDoSol(lat, lon);
        },
      );
    }
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            const delay = el.getAttribute('data-delay') || '0';
            setTimeout(() => {
              el.classList.add('visible');
            }, +delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.elementosAnimaveis.forEach((el) => {
      observer.observe(el.nativeElement);
    });
  }

  get avatarUrl(): string {
    return this.user?.photoURL || '../../../assets/images/sem_imagem_avatar.png';
  }

  notifySum() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();

    if (diaDaSemana === 5 && Notification.permission === 'granted') {
      setTimeout(() => {
        if (this.sunsetTime) {
          new Notification('Início do Sábado', {
            body: `O pôr do sol será às ${this.sunsetTime}. Feliz Sábado!`,
            icon: '/assets/icon/icon.png'
          });
        }
      }, 2000);
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
    this.router.navigate(['tabs/user-schedule']);
  }

  goToSabbathSchool() {
    this.router.navigate(['tabs/sabbath-school']);
  }

  async carregarProximosEventos(uid: string) {
    this.scheduleService.listarSchedules().subscribe((data) => {
      const todosEventos = data;
      const agora = moment();
      const futuros = todosEventos.filter((e: any) =>
        moment(e.dataHora).isSameOrAfter(agora)
      );

      futuros.sort((a: any, b: any) =>
        moment(a.dataHora).diff(moment(b.dataHora))
      );

      this.proximosEventos = futuros.slice(0, 3);
    });
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

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    const windowHeight = window.innerHeight;

    const image = document.getElementById('headerImage');
    if (image) {
      const fadeStart = 0;
      const fadeEnd = 150;
      const opacity = 1 - Math.min(Math.max((scrollTop - fadeStart) / (fadeEnd - fadeStart), 0), 1);
      image.style.opacity = opacity.toString();
    }

    this.elementosAnimaveis.forEach((elementRef: ElementRef) => {
      const el = elementRef.nativeElement;
      const rect = el.getBoundingClientRect();
      const delay = el.getAttribute('data-delay') || '0';

      if (
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        !el.classList.contains('visible')
      ) {
        setTimeout(() => {
          el.classList.add('visible');
        }, +delay);
      }
    });
  }

  async openPix() {
    const pixCode =
      '00020126430014br.gov.bcb.pix0114+5581999999995204000053039865802BR5920NOME DO RECEBEDOR6009SAO PAULO62290525mensagem de exemplo6304ABCD';

    const isPwa =
      window.matchMedia('(display-mode: standalone)').matches || // Android/Chrome
      (window.navigator as any).standalone === true; // iOS Safari

    if (isPwa) {
      // Está rodando como PWA → abrir seletor de banco com link Pix
      try {
        const pixUrl = `br.gov.bcb.pix://${pixCode}`;
        window.location.href = pixUrl; // força abertura do app de pagamento
      } catch (err) {
        console.error('Erro ao abrir Pix no PWA:', err);
        await navigator.clipboard.writeText(pixCode);
        alert('Não foi possível abrir o Pix, código copiado para a área de transferência.');
      }
    } else {
      try {
        await OpenPix.open({ code: pixCode });
      } catch (err) {
        console.error('Erro ao abrir Pix:', err);
        await navigator.clipboard.writeText(pixCode);
        alert('Não foi possível abrir o Pix, código copiado para a área de transferência.');
      }
    }
  }

  abrirInstagram() {
    window.open('https://www.instagram.com/adventistascidadedutra/', '_blank');
  }


  goToTimeLine() {
    this.router.navigate(['tabs/hub-cronograma']);
  }
}
