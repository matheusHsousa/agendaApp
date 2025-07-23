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
  people 
} from 'ionicons/icons';

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
  'people': people 
});

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
