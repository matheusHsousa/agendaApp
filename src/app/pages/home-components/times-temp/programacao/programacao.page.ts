import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonList, IonLabel, IonIcon, IonToolbar, IonTitle, IonButton,IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';

import { DatePipe } from '@angular/common';
import { CronogramaService } from 'src/app/services/cronograma.service';
import { NavigationService } from 'src/app/services/navigate.service';
import { IonHeader, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-programacao',
  templateUrl: './programacao.page.html',
  styleUrls: ['./programacao.page.scss'],
  standalone: true,
  imports: [IonItem, IonHeader, 
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
    IonAccordionGroup
  ],
  providers: [DatePipe]
})
export class ProgramacaoPage implements OnInit {

  programacoesPorPeriodo: { periodo: string, items: any[] }[] = [];

  constructor(
    private datePipe: DatePipe,
    private cronogramaService: CronogramaService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.cronogramaService.listarCronogramas().subscribe(data => {
      this.filtrarProgramacoesDoDia(data);
    });
  }

  filtrarProgramacoesDoDia(cronogramas: any[]) {
    const agora = new Date();

    // Ordena cronogramas por data e horaInicio
    cronogramas.sort((a, b) => {
      const dataA = new Date(a.data);
      const dataB = new Date(b.data);
      if (dataA.getTime() === dataB.getTime()) {
        return a.horaInicio.localeCompare(b.horaInicio);
      }
      return dataA.getTime() - dataB.getTime();
    });

    // Filtra só cronogramas futuros (data + horaInicio >= agora)
    const futuros = cronogramas.filter(c => {
      const data = new Date(c.data);
      const [h, m] = c.horaInicio.split(':').map(Number);
      data.setHours(h, m, 0, 0);
      return data >= agora;
    });

    // Tenta pegar cronogramas para hoje
    const hojeStr = this.datePipe.transform(agora, 'yyyy-MM-dd');
    let doDia = futuros.filter(c => this.datePipe.transform(c.data, 'yyyy-MM-dd') === hojeStr);

    // Se não tiver para hoje, pega o próximo dia disponível
    if (doDia.length === 0 && futuros.length > 0) {
      const proximoDiaStr = this.datePipe.transform(new Date(futuros[0].data), 'yyyy-MM-dd');
      doDia = futuros.filter(c => this.datePipe.transform(c.data, 'yyyy-MM-dd') === proximoDiaStr);
    }

    // Se ainda não tiver nenhum futuro, pega o último cronograma passado
    if (doDia.length === 0) {
      const ultimo = cronogramas[cronogramas.length - 1];
      doDia = [ultimo];
    }

    // Agrupa por período do dia
    const grupos: { [periodo: string]: any[] } = {
      'Manhã': [],
      'Tarde': [],
      'Noite': []
    };

    doDia.forEach(c => {
      const [h, m] = c.horaInicio.split(':').map(Number);
      if (h < 14) {
        grupos['Manhã'].push(c);
      } else if (h < 19) {
        grupos['Tarde'].push(c);
      } else {
        grupos['Noite'].push(c);
      }
    });

    // Monta o array só com grupos que tem itens
    this.programacoesPorPeriodo = [];

    ['Manhã', 'Tarde', 'Noite'].forEach(periodo => {
      if (grupos[periodo].length > 0) {
        this.programacoesPorPeriodo.push({ periodo, items: grupos[periodo] });
      }
    });
  }

  voltar() {
    this.navigationService.back();
  }
}