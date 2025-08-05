import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonIcon } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-meditacoes',
  templateUrl: './meditacoes.page.html',
  styleUrls: ['./meditacoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MeditacoesPage implements OnInit {
  icons = [
    {
      img: '../../../assets/images/meditacaoDiaria.png',
      label: 'Diaria',
      link: 'https://mais.cpb.com.br/meditacao/sinais-desatualizados/'
    },
    {
      img: '../../../assets/images/meditacaoJovem.png',
      label: 'Jovem',
      link: 'https://mais.cpb.com.br/meditacao/pescadores-de-homens/'
    },
    {
      img: '../../../assets/images/meditacaoMulher.png',
      label: 'Mulher',
      link: 'https://mais.cpb.com.br/meditacao/autopromocao-em-pequena-escala/'
    }
  ];


  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 0
  };


  constructor(private router: Router) { }

  ngOnInit() { }

  abrir(link: string) {
    this.router.navigate(['/iframe-medi'], { queryParams: { link } });
  }
}
