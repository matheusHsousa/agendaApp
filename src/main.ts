import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { addIcons } from 'ionicons';
import {
  card,
  book,
  calendar,
  logoInstagram,
  home,
  personCircle,
  shieldCheckmark,
  chevronBackOutline,
  chevronForwardOutline,
  people,
  logoGoogle,
  bookmarkOutline,
  alarm,
  create,
  trash,
  clipboard 
} from 'ionicons/icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';


addIcons({
  'card': card,
  'book': book,
  'calendar': calendar,
  'logo-instagram': logoInstagram,
  'home': home,
  'person-circle': personCircle,
  'shield-checkmark': shieldCheckmark,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'people': people, 
  'logo-google': logoGoogle,
  'bookmark-outline' : bookmarkOutline,
  'alarm' : alarm,
  'create' : create,
  'trash' : trash,
  'clipboard' : clipboard
});

if (Capacitor.isNativePlatform()) {
  GoogleAuth.initialize({
    clientId: '13685315862-fet1m22552gpm73ljknnui25op7ckf5d.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true
  });
  StatusBar.setOverlaysWebView({ overlay: false });
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
