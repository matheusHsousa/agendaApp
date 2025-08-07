import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private tabOrder = ['home', 'biblia', 'meditacoes', 'admin'];
  private currentTab = 'home';
  private lastTab: string | null = null;
  private wasNavigated = false;

  constructor(
    private router: Router,
    private location: Location
  ) { }

  navigate(path: string) {
    const match = path.match(/\/tabs\/([^\/]+)/);
    const targetTab = match ? match[1] : null;

    if (targetTab && targetTab !== this.currentTab) {
      const currentIndex = this.tabOrder.indexOf(this.currentTab);
      const targetIndex = this.tabOrder.indexOf(targetTab);
      const direction = targetIndex > currentIndex ? 'left' : 'right';

      this.animate(direction);
      this.lastTab = this.currentTab;
      this.currentTab = targetTab;
      this.wasNavigated = true;
    }

    this.router.navigateByUrl(path);
  }

  back() {
    // Só anima se a navegação anterior foi feita pelo `navigate()`
    if (this.wasNavigated && this.lastTab && this.lastTab !== this.currentTab) {
      const currentIndex = this.tabOrder.indexOf(this.currentTab);
      const lastIndex = this.tabOrder.indexOf(this.lastTab);
      const direction = lastIndex > currentIndex ? 'left' : 'right';

      this.animate(direction);
      this.currentTab = this.lastTab;
    }

    this.wasNavigated = false;

    setTimeout(() => {
      this.location.back();
    }, 300);
  }

  updateCurrentTab(tab: string) {
    this.currentTab = tab;
  }

  private animate(direction: 'left' | 'right') {
    const outlet = document.querySelector('ion-router-outlet');
    if (outlet) {
      outlet.classList.remove('slide-left', 'slide-right');
      void (outlet as HTMLElement).offsetWidth;
      outlet.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');

      setTimeout(() => {
        outlet.classList.remove('slide-left', 'slide-right');
      }, 300);
    }
  }
}
