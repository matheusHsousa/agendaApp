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
    // Espera até que os eventos estejam carregados
    const checkData = setInterval(() => {
      if (this.proximosEventos.length > 0 || this.user) {
        clearInterval(checkData);
        this.animateElements();
      }
    }, 100);
  }

  animateElements() {
    this.elementosAnimaveis.forEach((el, index) => {
      const delay = el.nativeElement.getAttribute('data-delay') || 0;
      setTimeout(() => {
        el.nativeElement.classList.add('animated');
      }, +delay);
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
      const fadeEnd = 300;
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
    // Scanner para PWA (web) usando @zxing/browser.
    // Requisitos: instalar `@zxing/browser` (ver instruções abaixo).
    try {
      // criar overlay simples com vídeo e botão fechar
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '99999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.background = 'rgba(0,0,0,0.6)';

      const container = document.createElement('div');
      container.style.width = '100%';
      container.style.maxWidth = '520px';
      container.style.borderRadius = '12px';
      container.style.overflow = 'hidden';
      container.style.background = 'rgba(0,0,0,0.75)';
      container.style.padding = '8px';

      const video = document.createElement('video');
      video.style.width = '100%';
      video.style.height = 'auto';
      video.setAttribute('autoplay', 'true');
      video.setAttribute('playsinline', 'true');

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.marginTop = '8px';
      closeBtn.style.width = '100%';
      closeBtn.style.padding = '10px';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '8px';
      closeBtn.style.background = 'var(--ion-color-primary)';
      closeBtn.style.color = '#fff';

      container.appendChild(video);
      container.appendChild(closeBtn);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      let codeReader: any;
      try {
        const zx = await import('@zxing/browser');
        const BrowserMultiFormatReader = zx.BrowserMultiFormatReader;
        codeReader = new BrowserMultiFormatReader();

        // decodeOnceFromVideoDevice retorna o primeiro resultado
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, video as HTMLVideoElement);
        const text = result.getText ? result.getText() : result.text || result;

        // cleanup
        codeReader.reset();
        document.body.removeChild(overlay);

        // ação padrão: copiar e oferecer compartilhar
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          console.warn('Não foi possível copiar automaticamente:', err);
        }

        if (navigator.share) {
          try {
            await navigator.share({ title: 'PIX', text });
            return;
          } catch (err) {
            // usuário pode cancelar o share — não é erro
          }
        }

        alert('Código PIX lido e copiado para área de transferência. Cole no app do seu banco.');
      } catch (err) {
        console.error('Erro no scanner PIX:', err);
        if (codeReader && codeReader.reset) codeReader.reset();
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        alert('Erro ao acessar a câmera ou decodificar o QR. Verifique permissões.');
      }

      closeBtn.addEventListener('click', () => {
        try { if (codeReader && codeReader.reset) codeReader.reset(); } catch (e) {}
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      });
    } catch (err) {
      console.error('openPix fallback error:', err);
      alert('Não foi possível abrir o scanner.');
    }
  }

  abrirInstagram() {
    window.open('https://www.instagram.com/adventistascidadedutra/', '_blank');
  }


  goToTimeLine() {
    this.router.navigate(['tabs/hub-cronograma']);
  }
}
