import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingService } from './services/loading.service';
import { CustomLoaderPage } from './../app/pages/custom-loader/custom-loader.page';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CustomLoaderPage],
  standalone: true,
  providers: [InAppBrowser],
})
export class AppComponent {
  isLoading = true;

  constructor(private loadingService: LoadingService, private authService: AuthService) { }


  async ngOnInit() {
    this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
    });
    await this.authService.handleRedirectCallback();
  }
}
