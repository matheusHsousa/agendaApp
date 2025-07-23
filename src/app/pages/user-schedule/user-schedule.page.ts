import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MinistryService } from 'src/app/services/ministries.service';

@Component({
  selector: 'app-user-schedule',
  templateUrl: './user-schedule.page.html',
  styleUrls: ['./user-schedule.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserSchedulePage implements OnInit {
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


  constructor(private ministryService: MinistryService, private scheduleService: ScheduleService, private location: Location) {
  }

  ngOnInit() {
    moment.locale('pt-br');
    this.carregarAgendamentosDoMes();
  }


  async carregarAgendamentosDoMes() {
    this.diasNoCalendario = [];
    this.diasComAgendamento = [];
    this.scheduleService.listarSchedules().subscribe((
      data
    ) => {;
    this.agendamentos = data
    console.log(this.agendamentos)

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

    setTimeout(() => {
      const container = document.getElementById('agendamentosContainer');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }


  proximoMes() {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }
    this.agendamentosDoDia = []

    this.carregarAgendamentosDoMes();
  }

  mesAnterior() {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }
    this.agendamentosDoDia = []

    this.carregarAgendamentosDoMes();
  }

  voltar() {
    this.location.back();
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
