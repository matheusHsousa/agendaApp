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
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data

    this.subscription = this.escalaService.listarEscalas().subscribe({
      next: (dados: any) => {
        console.log(dados);

        // Filtrar escalas futuras ou do dia atual
        const futuras = dados.filter((escala: any) => {
          const dataEscala = new Date(escala.data);
          dataEscala.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
          return dataEscala >= hoje;
        });

        // Ordenar por data
        futuras.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

        if (futuras.length === 0) {
          this.ministerios = [];
          return;
        }

        // Pegar a primeira data disponível (a mais próxima)
        const primeiraData = new Date(futuras[0].data);
        primeiraData.setHours(0, 0, 0, 0);

        // Filtrar todas as escalas dessa data
        const escalasProximaData = futuras.filter((escala: any) => {
          const dataEscala = new Date(escala.data);
          dataEscala.setHours(0, 0, 0, 0);
          return dataEscala.getTime() === primeiraData.getTime();
        });

        // Formatar os dados para exibição
        this.ministerios = escalasProximaData.map((escala: any) => {
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
