import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.page.html',
  styleUrls: ['./custom-loader.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CustomLoaderPage implements OnInit {
  @Input() isLoading = false;

  loadingText = 'Carregando';
  private intervalId?: any;
  private dotCount = 0;

  ngOnInit() {
    this.startLoadingTextAnimation();
  }

  ngOnDestroy() {
    this.stopLoadingTextAnimation();
  }

  startLoadingTextAnimation() {
    this.intervalId = setInterval(() => {
      this.dotCount = (this.dotCount + 1) % 4; // 0 a 3
      this.loadingText = 'Carregando' + '.'.repeat(this.dotCount);
    }, 500); // atualiza a cada 500ms
  }

  stopLoadingTextAnimation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
