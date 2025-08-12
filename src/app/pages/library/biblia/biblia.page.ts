import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibleService } from 'src/app/services/bible.service';
import { IonicModule, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BibliaPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  bibleData: any;
  livroSelecionado: any;
  capituloAtual: any[] = [];
  indiceCapituloAtual: number = 0;
  indiceVersiculoAtual: number = 0;

  constructor(private bibleService: BibleService) { }

  ngOnInit() {
    this.bibleService.getBible().subscribe(data => {
      this.bibleData = data;

      const livroSalvo = localStorage.getItem('livroSelecionado');
      const capituloSalvo = localStorage.getItem('indiceCapituloAtual');
      const versiculoSalvo = localStorage.getItem('indiceVersiculoAtual');

      if (livroSalvo) {
        const livroObj = this.bibleData.find((l: any) => l.name === livroSalvo);
        if (livroObj) {
          this.livroSelecionado = livroObj;
          this.indiceCapituloAtual = capituloSalvo ? +capituloSalvo : 0;
          this.carregarCapitulo(this.indiceCapituloAtual);

          this.indiceVersiculoAtual = versiculoSalvo ? +versiculoSalvo : 0;
          this.selecionarVersiculo(this.indiceVersiculoAtual);
          return;
        }
      }

      this.livroSelecionado = this.bibleData[0];
      this.indiceCapituloAtual = 0;
      this.indiceVersiculoAtual = 0;

      this.carregarCapitulo(0);
      this.selecionarVersiculo(0);
    });
  }

  carregarCapitulo(capituloIndex = 0) {
    if (!this.livroSelecionado) return;
    this.indiceCapituloAtual = capituloIndex;

    this.capituloAtual = this.livroSelecionado.chapters[capituloIndex].map(
      (texto: string, i: number) => ({
        numero: i + 1,
        texto: texto
      })
    );

    if (this.indiceVersiculoAtual >= this.capituloAtual.length) {
      this.indiceVersiculoAtual = 0;
    }
    this.selecionarVersiculo(this.indiceVersiculoAtual);

    localStorage.setItem('livroSelecionado', this.livroSelecionado.name);
    localStorage.setItem('indiceCapituloAtual', this.indiceCapituloAtual.toString());
  }

  selecionarVersiculo(indice: number) {
    this.indiceVersiculoAtual = indice;

    // Salvar versículo selecionado
    localStorage.setItem('indiceVersiculoAtual', this.indiceVersiculoAtual.toString());

    // Dar um timeout para garantir que o DOM esteja atualizado
    setTimeout(() => {
      const id = 'versiculo-' + (this.indiceVersiculoAtual + 1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  anteriorCapitulo() {
    if (!this.livroSelecionado) return;

    if (this.indiceCapituloAtual > 0) {
      this.indiceCapituloAtual--;
      this.carregarCapitulo(this.indiceCapituloAtual);
    }
  }

  proximoCapitulo() {
    if (!this.livroSelecionado) return;

    if (this.indiceCapituloAtual < this.livroSelecionado.chapters.length - 1) {
      this.indiceCapituloAtual++;
      this.carregarCapitulo(this.indiceCapituloAtual);
    }
  }

  onLivroChange(event: any) {
    this.livroSelecionado = event.detail.value;
    this.indiceCapituloAtual = 0;
    this.indiceVersiculoAtual = 0;
    this.carregarCapitulo(0);
  }

  onCapituloChange(event: any) {
    this.indiceCapituloAtual = event.detail.value;
    this.carregarCapitulo(this.indiceCapituloAtual);
  }

  onVersiculoChange(event: any) {
    this.indiceVersiculoAtual = event.detail.value;
    this.selecionarVersiculo(this.indiceVersiculoAtual);
  }

}
