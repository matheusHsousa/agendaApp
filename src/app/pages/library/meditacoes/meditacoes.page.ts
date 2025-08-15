import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular';
import { NavigationService } from 'src/app/services/navigate.service';

register()

@Component({
  selector: 'app-meditacoes',
  templateUrl: './meditacoes.page.html',
  styleUrls: ['./meditacoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule
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

  loadingIcons: boolean[] = [];
  loadingLivros: boolean[] = [];

  swiperModules = [IonicSlides];

  livros = [
    { titulo: 'A Ciencia do Bom Viver', img: 'assets/livros/cienciaDoBomViver.png', pdf: 'assets/livros/A-Ciencia-do-Bom-Viver.pdf' },
    { titulo: 'A Verdade sobre os Anjos', img: 'assets/livros/atos.png', pdf: 'assets/livros/A-Verdade-sobre-os-Anjos.pdf' },
    { titulo: 'Atos dos Apostolos', img: 'assets/livros/atos.png', pdf: 'assets/livros/Atos-dos-Apostolos.pdf' },
    { titulo: 'Caminho a Cristo', img: 'assets/livros/caminhoACristo.png', pdf: 'assets/livros/Caminho-a-Cristo-nova-edicao.pdf' },
    { titulo: 'Cartas a Jovens Namorados', img: 'assets/livros/cartaaJovensNamorados.png', pdf: 'assets/livros/Cartas-a-Jovens-Namorados.pdf' },
    { titulo: 'Conselho Escola Sabatina', img: 'assets/livros/conselhoEscolaSabatina.png', pdf: 'assets/livros/conselhoEscolaSabatina.pdf' },
    { titulo: 'Conselhos para a Igreja', img: 'assets/livros/conselhosParaIgreja.png', pdf: 'assets/livros/Conselhos-para-a-Igreja.pdf' },
    { titulo: 'Conselhos sobre a Escola Sabatina', img: 'assets/livros/conselhoEscolaSabatina.png', pdf: 'assets/livros/Conselhos-sobre-a-Escola-Sabatina.pdf' },
    { titulo: 'Conselhos sobre Mordomia', img: 'assets/livros/conselhosSobreMordomia.png', pdf: 'assets/livros/Conselhos-sobre-Mordomia.pdf' },
    { titulo: 'Conselhos sobre Saúde', img: 'assets/livros/ConselhoSobreSaude.png', pdf: 'assets/livros/Conselhos-sobre-Saude.pdf' },
    { titulo: 'Eventos Finais', img: 'assets/livros/eventosFinais.png', pdf: 'assets/livros/Eventos-Finais.pdf' },
    { titulo: 'Historia da Redencao', img: 'assets/livros/historiaDaRedecao.png', pdf: 'assets/livros/Historia-da-Redencao.pdf' },
    { titulo: 'Mensagens aos Jovens', img: 'assets/livros/mensagensAosJovens.png', pdf: 'assets/livros/Mensagens-aos-Jovens.pdf' },
    { titulo: 'Mente Carater e Personalidade 1', img: 'assets/livros/menteCaraterEPersonalidade1.png', pdf: 'assets/livros/Mente-Carater-e-Personalidade-1.pdf' },
    { titulo: 'Mente Carater e Personalidade 2', img: 'assets/livros/menteCaraterEPersonalidade2.png', pdf: 'assets/livros/Mente-Carater-e-Personalidade-2.pdf' },
    { titulo: 'O Desejado de Todas as Nacoes', img: 'assets/livros/OdesejadoDeTodasAsNacçoes.png', pdf: 'assets/livros/O-Desejado-de-Todas-as-Nacoes.pdf' },
    { titulo: 'O Grande Conflito', img: 'assets/livros/OGrandeConflito.png', pdf: 'assets/livros/O-Grande-Conflito.pdf' },
    { titulo: 'O Lar Adventista', img: 'assets/livros/OLarAdventista.png', pdf: 'assets/livros/O-Lar-Adventista.pdf' },
    { titulo: 'Orientacao da Crianca', img: 'assets/livros/OrientaçãoDaCriança.png', pdf: 'assets/livros/Orientacao-da-Crianca.pdf' },
    { titulo: 'Patriarcas e Profetas', img: 'assets/livros/PatriarcasEProfetas.png', pdf: 'assets/livros/Patriarcas-e-Profetas.pdf' },
    { titulo: 'Profetas e Reis', img: 'assets/livros/ProfetasEReis.png', pdf: 'assets/livros/Profetas-e-Reis.pdf' },
    { titulo: 'Vida de Jesus', img: 'assets/livros/VidaDeJesus.png', pdf: 'assets/livros/Vida-de-Jesus.pdf' }
  ];



  currentPage = 1;
  totalPages = 0;

  constructor(private router: Router, private navigationService: NavigationService) { }

  ngOnInit() {
    this.loadingIcons = new Array(this.icons.length).fill(true);
    this.loadingLivros = new Array(this.livros.length).fill(true);
  }

  onImageLoad(type: 'icon' | 'livro', index: number) {
    if (type === 'icon') {
      this.loadingIcons[index] = false;
    } else {
      this.loadingLivros[index] = false;
    }
  }

  abrir(link: string) {
    this.router.navigate(['tabs/iframe-medi'], { queryParams: { link } });
  }

  abrirLivro(pdf: string) {
    this.router.navigate(['tabs/livro-viewer'], { queryParams: { pdf } });
  }

  voltar() {
    this.navigationService.back();
  }
}
