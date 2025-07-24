import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingService } from './services/loading.service';
import { CustomLoaderPage } from './../app/pages/custom-loader/custom-loader.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CustomLoaderPage],
  standalone: true,
  providers: [InAppBrowser],
})
export class AppComponent {
  isLoading = true;

   constructor(private loadingService: LoadingService) {}

   
  ngOnInit() {
    this.loadingService.loading$.subscribe(status => {
      console.log('status', status); // Adicione isso
      this.isLoading = status;
    });
  }
}
