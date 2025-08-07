import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonDatetime,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { ScheduleService } from 'src/app/services/schedule.service';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MinistryService } from 'src/app/services/ministries.service';
import { NavigationService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonDatetime,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SchedulesComponent {
  editarModo: boolean = false;
  idEditando: string | null = null;
  agendamento = {
    dataHora: '',
    nomeEvento: '',
    ministerio: '',
    nomePregador: '',
    quemAgendou: ''
  };

  mostrarCalendario = false;
  mesAtual = new Date().getMonth();
  anoAtual = new Date().getFullYear();
  diasNoCalendario: { numero: number; data: string }[] = [];
  diasComAgendamento: string[] = [];
  agendamentos: any[] = [];
  agendamentosDoDia: any[] = [];
  diaSelecionado: string = '';
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  menuSelecionado: string = 'formulario';
  ministerios: any[] = [];


  constructor(private ministryService: MinistryService, private scheduleService: ScheduleService, private navigationService: NavigationService) { }

  ngOnInit() {
    moment.locale('pt-br');
    this.carregarAgendamentosDoMes();
    this.listarMinisterios();
  }

  onDateTimeChange(event: any) {
    this.agendamento.dataHora = event.detail.value;
  }

  async onSubmit() {
    if (this.editarModo && this.idEditando) {
      try {
        await this.scheduleService.editarSchedule(this.idEditando, this.agendamento);
        alert('Agendamento atualizado com sucesso!');
      } catch (err) {
        console.error('Erro ao atualizar agendamento:', err);
        alert('Erro ao atualizar agendamento.');
        return;
      }
    } else {
      try {
        await this.scheduleService.salvarSchedule(this.agendamento);
        alert('Agendamento salvo com sucesso!');
      } catch (err) {
        console.error('Erro ao salvar agendamento:', err);
        alert('Erro ao salvar agendamento.');
        return;
      }
    }

    this.agendamento = {
      dataHora: '',
      nomeEvento: '',
      ministerio: '',
      nomePregador: '',
      quemAgendou: ''
    };
    this.editarModo = false;
    this.idEditando = null;

    await this.carregarAgendamentosDoMes();
    if (this.diaSelecionado) {
      this.selecionarDia(this.diaSelecionado);
    }
  }


  async listarMinisterios() {
    this.ministryService.listarMinisterios().subscribe(data => {
      this.ministerios = data;
    });
  }

  async carregarAgendamentosDoMes() {
    this.diasNoCalendario = [];
    this.diasComAgendamento = [];
    this.scheduleService.listarSchedules().subscribe((data) => {


      this.agendamentos = data

      const primeiroDia = moment(new Date(this.anoAtual, this.mesAtual)).startOf('month');
      const qtdDias = primeiroDia.daysInMonth();
      const diaSemanaInicio = primeiroDia.day();

      for (let i = 0; i < diaSemanaInicio; i++) {
        this.diasNoCalendario.push({ numero: 0, data: '' });
      }

      for (let dia = 1; dia <= qtdDias; dia++) {
        const dataFormatada = moment(new Date(this.anoAtual, this.mesAtual, dia)).format('YYYY-MM-DD');
        this.diasNoCalendario.push({ numero: dia, data: dataFormatada });

        const existe = this.agendamentos.some(a =>
          a.dataHora.startsWith(dataFormatada)
        );
        if (existe) this.diasComAgendamento.push(dataFormatada);
      }
    })
  }

  selecionarDia(data: string) {
    this.diaSelecionado = data;
    this.agendamentosDoDia = this.agendamentos.filter(a =>
      a.dataHora.startsWith(data)
    );
  }

  proximoMes() {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }
    this.carregarAgendamentosDoMes();
  }

  mesAnterior() {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }
    this.carregarAgendamentosDoMes();
  }

  voltar() {
    this.navigationService.back();
  }

  async excluirEvento(id: string) {
    try {
      await this.scheduleService.excluirSchedule(id);
      alert('Agendamento excluído com sucesso!');
      await this.carregarAgendamentosDoMes();
      if (this.diaSelecionado) {
        this.selecionarDia(this.diaSelecionado);
      }
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
      alert('Erro ao excluir agendamento.');
    }
  }

  editarEvento(evento: any) {
    this.menuSelecionado = 'formulario';

    this.agendamento = {
      dataHora: evento.dataHora,
      nomeEvento: evento.nomeEvento,
      ministerio: evento.ministerio,
      nomePregador: evento.nomePregador,
      quemAgendou: evento.quemAgendou
    };

    this.idEditando = evento.id;
    this.editarModo = true;
  }

  formatarDiaSemana(dataHora: string): string {
    let dia = moment(dataHora).format('dddd');
    dia = dia.split('-')[0];
    const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
    const dataFormatada = moment(dataHora).format('DD/MM/YY');
    return `${diaCapitalizado}, ${dataFormatada}`;
  }

  formatarHora(dataHora: string): string {
    return moment(dataHora).format('HH:mm');
  }
}
