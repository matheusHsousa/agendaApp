import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonDatetime,
  IonReorder,
  IonReorderGroup, IonAccordionGroup, IonAccordion, IonIcon, IonNote
} from '@ionic/angular/standalone';
import { CronogramaService } from 'src/app/services/cronograma.service';
import { AlertController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-programacao-admin',
  templateUrl: './programacao-admin.page.html',
  styleUrls: ['./programacao-admin.page.scss'],
  standalone: true,
  imports: [IonNote, IonIcon, IonAccordion, IonAccordionGroup,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonDatetime,
    IonReorder,
    IonReorderGroup
  ]
})
export class ProgramacaoAdminPage implements OnInit {
  tabSelecionada = 'criar';
  horarioInvalido = false;


  data: string = '';
  horaInicio: string = '';
  atividades: any[] = [
    { cronograma: '', linhaFrente: '', responsavel: '', duracao: 5, ordem: 0 }
  ];

  cronogramas: any[] = [];
  extendendoCronogramaId: string | null = null;

  constructor(
    private cronogramaService: CronogramaService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,) { }

  ngOnInit() {
    this.carregarCronogramas();
  }

  carregarCronogramas() {
    this.cronogramaService.listarCronogramas().subscribe({
      next: (dados) => {
        this.cronogramas = dados.map(escala => ({
          id: escala.id,
          data: escala.data,
          horaInicio: escala.horaInicio || '',
          atividades: (escala.atividades || [])
            .map((a: any) => ({ ...a, _uid: a._uid || this.generateId() }))
            .sort((a: any, b: any) => {
              const [ha, ma] = a.horario.split(':').map(Number);
              const [hb, mb] = b.horario.split(':').map(Number);

              return (ha * 60 + ma) - (hb * 60 + mb);
            })
        }));
        console.log(this.cronogramas);
      },
      error: (err) => console.error('Erro ao carregar cronogramas', err)
    });
  }

  adicionarAtividade() {
    const novaOrdem = this.atividades.length;
    this.atividades.push({ cronograma: '', linhaFrente: '', responsavel: '', duracao: 5, ordem: novaOrdem });
  }

  async salvar() {
    this.atividades = this.atividades.map((atv, i) => ({ ...atv, ordem: i }));

    try {
      if (this.extendendoCronogramaId) {
        // Caso de extensão de cronograma existente
        const cronogramaExistente = await this.cronogramaService.obterCronogramaPorId(this.extendendoCronogramaId);

        // Combina as atividades (mantém as existentes e adiciona as novas)
        const todasAtividades = [
          ...cronogramaExistente.atividades,
          ...this.atividades
        ];

        // Recalcula TODOS os horários desde o início do cronograma original
        const atividadesComHorarios = this.cronogramaService.calcularHorarios(
          cronogramaExistente.horaInicio, // Usa o horário original de início
          todasAtividades
        );

        // Atualiza o cronograma existente
        await this.cronogramaService.editarCronograma(
          this.extendendoCronogramaId,
          { atividades: atividadesComHorarios }
        );

        this.extendendoCronogramaId = null;
      } else {
        // Caso de novo cronograma
        await this.cronogramaService.criarCronograma(
          this.data,
          this.horaInicio,
          this.atividades
        );
      }

      this.carregarCronogramas();
      this.tabSelecionada = 'editar';
      this.atividades = [{ cronograma: '', linhaFrente: '', responsavel: '', duracao: 30, ordem: 0 }];
    } catch (err) {
      console.error('Erro ao salvar cronograma:', err);
      alert('Erro ao salvar cronograma');
    }
  }

  formatarDataComPeriodo(dataStr: string, horaInicio: string) {
    const data = new Date(dataStr);
    const hora = Number(horaInicio.split(':')[0]);

    let periodo = '';
    if (hora >= 0 && hora < 14) {
      periodo = 'manhã';
    } else if (hora >= 14 && hora < 18) {
      periodo = 'tarde';
    } else {
      periodo = 'noite';
    }

    const dataFormatada = data.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return `${dataFormatada} - ${periodo}`;
  }

  handleReorder(event: any, cronograma: any) {
    cronograma.atividades = event.detail.complete(cronograma.atividades);

    cronograma.atividades = this.cronogramaService.calcularHorarios(
      cronograma.horaInicio,
      cronograma.atividades
    );

    cronograma.atividades = cronograma.atividades.map((atv: any, i: number) => ({
      ...atv,
      ordem: i
    }));

    this.cdr.detectChanges();
  }


  private generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }


  async removerAtividade(cronograma: any, index: number) {
    cronograma.atividades.splice(index, 1);

    // Se não houver mais atividades, deleta o cronograma
    if (cronograma.atividades.length === 0) {
      try {
        await this.cronogramaService.excluirCronograma(cronograma.id);
        this.carregarCronogramas(); // Recarrega a lista
        return;
      } catch (err) {
        console.error('Erro ao deletar cronograma vazio:', err);
        alert('Erro ao deletar cronograma vazio');
        return;
      }
    }

    // Se ainda há atividades, atualiza as ordens e recalcula horários
    cronograma.atividades = cronograma.atividades.map((atv: any, i: number) => ({
      ...atv,
      ordem: i
    }));

    cronograma.atividades = this.cronogramaService.calcularHorarios(
      cronograma.horaInicio,
      cronograma.atividades
    );

    // Salva as alterações
    this.salvarEdicao(cronograma);
  }

  async salvarEdicao(cronograma: any) {
    // Verifica se o cronograma está vazio
    if (cronograma.atividades.length === 0) {
      try {
        await this.cronogramaService.excluirCronograma(cronograma.id);
        this.carregarCronogramas();
        return;
      } catch (err) {
        console.error('Erro ao deletar cronograma vazio:', err);
        alert('Erro ao deletar cronograma vazio');
        return;
      }
    }

    // Se não estiver vazio, continua com o processo normal
    cronograma.atividades.forEach((atv: any) => {
      if (atv.editando) {
        atv.editando = false;
        delete atv.originalValues;
      }
    });

    cronograma.atividades = this.cronogramaService.calcularHorarios(
      cronograma.horaInicio,
      cronograma.atividades
    );

    this.cronogramaService.editarCronograma(
      cronograma.id,
      { atividades: cronograma.atividades }
    ).then(() => {
      console.log('Cronograma atualizado com sucesso!');
      this.carregarCronogramas();
    }).catch(err => console.error('Erro ao salvar edição:', err));
  }

  trackByIndex(index: number, item: any) {
    return item.ordem ?? index;
  }

  trackById(index: number, item: any) {
    return item.id || index;
  }

  ativarEdicao(atividade: any) {
    atividade.originalValues = {
      cronograma: atividade.cronograma,
      linhaFrente: atividade.linhaFrente,
      responsavel: atividade.responsavel,
      duracao: atividade.duracao
    };
    atividade.editando = true;
  }

  cancelarEdicao(atividade: any) {
    if (atividade.originalValues) {
      atividade.cronograma = atividade.originalValues.cronograma;
      atividade.linhaFrente = atividade.originalValues.linhaFrente;
      atividade.responsavel = atividade.originalValues.responsavel;
      atividade.duracao = atividade.originalValues.duracao;
    }
    atividade.editando = false;
  }

  salvarEdicaoAtividade(cronograma: any, atividade: any) {
    atividade.editando = false;
    delete atividade.originalValues;

    cronograma.atividades = this.cronogramaService.calcularHorarios(
      cronograma.horaInicio,
      cronograma.atividades
    );

    this.cdr.detectChanges();
  }

  copiarParaCriar(cronograma: any) {
    this.tabSelecionada = 'criar';
    this.data = cronograma.data;
    this.extendendoCronogramaId = cronograma.id;

    const ultimaAtividade = cronograma.atividades[cronograma.atividades.length - 1];
    const [hora, minuto] = ultimaAtividade.horario.split(':').map(Number);
    const duracao = ultimaAtividade.duracao || 0;

    let novoMinuto = minuto + duracao;
    let novaHora = hora + Math.floor(novoMinuto / 60);
    novoMinuto = novoMinuto % 60;

    this.horaInicio = `${String(novaHora).padStart(2, '0')}:${String(novoMinuto).padStart(2, '0')}`;

    this.atividades = [{ cronograma: '', linhaFrente: '', responsavel: '', duracao: 30, ordem: 0 }];
  }

  async validarHorarioInicio() {
    if (!this.data || !this.horaInicio) {
      this.horarioInvalido = false;
      return;
    }

    try {
      const cronogramasExistentes = await this.cronogramaService.obterCronogramasPorData(this.data);
      this.horarioInvalido = cronogramasExistentes.some(cronograma =>
        this.cronogramaService.verificarConflitos(this.horaInicio, cronograma.atividades)
      );
    } catch (err) {
      console.error('Erro ao validar horário:', err);
      this.horarioInvalido = false;
    }
  }

  async confirmarRemoverAtividade(cronograma: any, index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: cronograma.atividades.length === 1
        ? 'Esta é a última atividade. Removê-la deletará todo o cronograma. Continuar?'
        : 'Deseja remover esta atividade?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Remover',
          handler: () => {
            this.removerAtividade(cronograma, index);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarRemoverCronograma(cronograma: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o cronograma de <strong>${this.formatarDataComPeriodo(cronograma.data, cronograma.horaInicio)}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            try {
              await this.cronogramaService.excluirCronograma(cronograma.id);
              this.carregarCronogramas();
            } catch (err) {
              console.error('Erro ao excluir cronograma:', err);

            }
          }
        }
      ]
    });

    await alert.present();
  }

}
