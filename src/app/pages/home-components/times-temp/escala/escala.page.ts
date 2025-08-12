import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/angular/standalone';
import { NavigationService } from 'src/app/services/navigate.service';
import { EscalaService } from 'src/app/services/escala.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-escala',
  templateUrl: './escala.page.html',
  styleUrls: ['./escala.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonAccordion,
    IonAccordionGroup,
  ],
})

export class EscalaPage implements OnInit {
  ministerios: any[] = [];
  private subscription?: Subscription;

  constructor(
    private navigationService: NavigationService,
    private escalaService: EscalaService
  ) { }

  ngOnInit() {
    this.carregarEscalas();
  }

  carregarEscalas() {
    const hoje = new Date();

    this.subscription = this.escalaService.listarEscalas().subscribe({
      next: (dados: any) => {
        console.log(dados);

        // Filtra só escalas a partir de hoje
        const futuras = dados.filter((escala: any) => {
          const dataEscala = new Date(escala.data);
          return dataEscala >= hoje;
        });

        // Ordena por data
        futuras.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

        if (futuras.length === 0) {
          this.ministerios = [];
          return;
        }

        // Pega a data mais próxima
        const primeiraData = new Date(futuras[0].data);
        const diaMaisProximo = primeiraData.toISOString().split('T')[0]; // "YYYY-MM-DD"

        // Filtra todas as escalas desse mesmo dia
        const mesmasDoDia = futuras.filter((escala: any) => {
          return escala.data.startsWith(diaMaisProximo);
        });

        // Mapeia para o formato usado no HTML
        this.ministerios = mesmasDoDia.map((escala: any) => {
          const dataObj = new Date(escala.data);
          const diasSemana = [
            'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
            'Quinta-feira', 'Sexta-feira', 'Sábado'
          ];
          const diaSemana = diasSemana[dataObj.getDay()];
          const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
          });

          return {
            titulo: `${escala.ministerio} - ${dataFormatada} (${diaSemana})`,
            ministerio: escala.ministerio,
            nomes: escala.pessoasArray || [],
            dataEscala: dataFormatada,
          };
        });
      },
      error: (err: any) => {
        console.error('Erro ao carregar escalas:', err);
      }
    });
  }

  voltar() {
    this.navigationService.back();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
