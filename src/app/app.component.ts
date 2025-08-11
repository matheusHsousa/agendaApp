import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingService } from './services/loading.service';
import { CustomLoaderPage } from './../app/pages/custom-loader/custom-loader.page';
import { AuthService } from './services/auth.service';
import { AnimationController } from '@ionic/angular';

declare var OneSignal: any;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CustomLoaderPage],
  standalone: true,
  providers: [InAppBrowser],
})
export class AppComponent implements OnInit {
  isLoading = true;
  

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    // Monitora o loader
    this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
    });

    // Trata login/callback
    this.authService.handleRedirectCallback();

   if ((window as any).cordova) {
      OneSignal.setAppId('4bc30d9a-f6d3-4b56-b1ed-1931a2a55960');

      OneSignal.promptForPushNotificationsWithUserResponse((response: any) => {
        console.log('Permissão para push:', response);
      });

      OneSignal.addEventListener('notificationOpened', (jsonData: any) => {
        console.log('Notificação aberta:', jsonData);
      });
    }
  }

  fadeAnimation = (_baseEl: any, opts?: any) => {
    const enteringEl = opts?.enteringEl;

    return this.animationCtrl.create()
      .addElement(enteringEl)
      .duration(200)
      .fromTo('opacity', 0, 1);
  };
}
