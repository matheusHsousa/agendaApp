import { Component, OnInit, ChangeDetectorRef, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonDatetime,
  IonReorder,
  IonCardTitle,
  IonCardContent,
  IonReorderGroup, IonAccordionGroup, IonAccordion, IonIcon, IonNote, IonCard, IonText
} from '@ionic/angular/standalone';
import { CronogramaService } from 'src/app/services/cronograma.service';
import { AlertController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigate.service';


@Component({
  selector: 'app-programacao-admin',
  templateUrl: './programacao-admin.page.html',
  styleUrls: ['./programacao-admin.page.scss'],
  standalone: true,
  imports: [IonCard, IonNote, IonIcon, IonAccordion, IonAccordionGroup,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonDatetime,
    IonReorder,
    IonReorderGroup,
    IonCardHeader,
    IonCardContent,
    ReactiveFormsModule,
    IonCardTitle,
  ]
})
export class ProgramacaoAdminPage implements OnInit {
  tabSelecionada = 'criar';
  horarioInvalido = false;
  camposTocados: Record<string, boolean> = {};
  atividadesTocadas: Record<number, Record<string, boolean>> = {};
  @ViewChild(IonContent) ionContent!: IonContent;

  data: string = '';
  horaInicio: string = '';
  atividades: any[] = [
    { cronograma: '', linhaFrente: '', responsavel: '', duracao: 5, ordem: 0 }
  ];

  cronogramas: any[] = [];
  extendendoCronogramaId: string | null = null;

  modeloSelecionado: string = 'personalizado';

  MODELOS_PADRAO = {
    sabado: {
      nome: 'Sábado',
      atividades: [
        { cronograma: 'Boas Vindas', linhaFrente: 'Vicente', responsavel: 'Juliano', duracao: 1 },
        { cronograma: 'Hino Inicial [N.H.A. 375 - "Canção da Vida"]', linhaFrente: 'Equipe de Louvor', responsavel: 'Juliano', duracao: 4 },
        { cronograma: 'Oração Inicial', linhaFrente: 'Patrícia', responsavel: 'Juliano', duracao: 1 },
        { cronograma: 'Informativo Mundial das Missões', linhaFrente: 'Vídeo', responsavel: 'Juliano', duracao: 4 },
        { cronograma: 'Mensagem Musical', linhaFrente: 'Wagner', responsavel: 'Juliano', duracao: 5 },
        { cronograma: 'Introdução ao Estudo e Divisão das Classes', linhaFrente: 'Vicente', responsavel: 'Juliano', duracao: 46 },
        { cronograma: 'Encerramento + Oração', linhaFrente: 'Nalva', responsavel: 'Juliano', duracao: 1 },
        { cronograma: 'Mensagem Musical', linhaFrente: 'Wagner', responsavel: 'Juliano', duracao: 5 },
        { cronograma: 'Hino Final [N.H.A. 69 - "Obrigado bom Pai"]', linhaFrente: 'Equipe de Louvor', responsavel: 'Juliano', duracao: 4 },
        { cronograma: 'Oração Final', linhaFrente: 'Ivete', responsavel: 'Juliano', duracao: 1 },
        { cronograma: 'Anúncios', linhaFrente: 'Ivo', responsavel: 'Juliano', duracao: 5 },
        { cronograma: 'Minuto Missionário', linhaFrente: 'Roberto', responsavel: 'Juliano', duracao: 2 },
        { cronograma: 'Recolta 2025', linhaFrente: 'Ivoninha/Valter', responsavel: 'Juliano', duracao: 2 },
        { cronograma: 'Boas Vindas', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 1 },
        { cronograma: 'Hino Introdutório [N.H.A. 564 - Vamos Adorar]', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 4 },
        { cronograma: 'Oração Inicial', linhaFrente: 'Pr. Hélio Porto', responsavel: 'Vicente/Solange', duracao: 1 },
        { cronograma: 'Adoração Infantil', linhaFrente: 'Aline', responsavel: 'Vicente/Solange', duracao: 14 },
        { cronograma: 'Momento do Ofertório', linhaFrente: 'Vídeo (Provai e Vede)', responsavel: 'Vicente/Solange', duracao: 5 },
        { cronograma: 'Música Ofertório [Oferta Maior]', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 4 },
        { cronograma: 'Mensagem Musical', linhaFrente: 'Wagner', responsavel: 'Vicente/Solange', duracao: 5 },
        { cronograma: 'Momento de Louvor [N.H.A. 362 - "O Melhor Lugar do Mundo"]', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 10 },
        { cronograma: 'Momento de Louvor [N.H.A. 358 - "Só Com Teu Deus"]', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 10 },
        { cronograma: 'Oração Intercessória', linhaFrente: 'Ancionato', responsavel: 'Vicente/Solange', duracao: 3 },
        { cronograma: 'Sermão', linhaFrente: 'Pr. Hélio Porto', responsavel: 'Vicente/Solange', duracao: 40 },
        { cronograma: 'Hino Final [N.H.A. 486 - "Até Então"]', linhaFrente: 'Equipe de Louvor', responsavel: 'Vicente/Solange', duracao: 4 },
        { cronograma: 'Oração Final', linhaFrente: 'Pr. Hélio Porto', responsavel: 'Vicente/Solange', duracao: 2 },
        { cronograma: 'Hino Despedida [N.H.A. 592 - Ao Sair Deste Santo Lugar]', linhaFrente: 'Equipe de Louvor [Nos Braços de Jesus]', responsavel: 'Vicente/Solange', duracao: 4 },
        { cronograma: 'Saída Organizada pelos Diáconos', linhaFrente: '-', responsavel: '-', duracao: 1 }
      ]
    },
    domingo: {
      nome: 'Domingo',
      atividades: [
        { cronograma: '235 - Somos Teus, Senhor (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 },
        { cronograma: '362 - O Melhor Lugar do Mundo (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 },
        { cronograma: '240 -  Brilhar por Ti - (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 }
      ]
    },
    quarta: {
      nome: 'Quarta-feira',
      atividades: [
        { cronograma: '235 - Somos Teus, Senhor (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 },
        { cronograma: '362 - O Melhor Lugar do Mundo (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 },
        { cronograma: '240 -  Brilhar por Ti - (NHA)', linhaFrente: 'Equipe de Louvor: André, Viviane, Thiago', responsavel: 'Líder de Regência: Viviane', duracao: 5 }
      ]
    }
  };

  constructor(
    private cronogramaService: CronogramaService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private navigationService: NavigationService
  ) { }

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
      },
      error: (err) => console.error('Erro ao carregar cronogramas', err)
    });
  }

  voltar() {
    this.navigationService.back();
  }

  aplicarModelo() {
    if (this.modeloSelecionado === 'personalizado') {
      return;
    }

    const modelo = this.MODELOS_PADRAO[this.modeloSelecionado as keyof typeof this.MODELOS_PADRAO];

    this.atividades = [];

    modelo.atividades.forEach((atv, index) => {
      this.atividades.push({
        ...atv,
        ordem: index
      });
    });

    this.horaInicio = this.modeloSelecionado === 'sabado' ? '09:00' :
      this.modeloSelecionado === 'domingo' ? '19:00' : '20:00';

    this.camposTocados['horaInicio'] = true;
    this.atividades.forEach((_, index) => {
      this.atividadesTocadas[index] = {
        cronograma: true,
        linhaFrente: true,
        responsavel: true,
        duracao: true
      };
    });
  }

  adicionarAtividade() {
    const novaOrdem = this.atividades.length;
    this.atividades.push({ cronograma: '', linhaFrente: '', responsavel: '', duracao: 5, ordem: novaOrdem });

    setTimeout(() => {
      this.ionContent.scrollToBottom(600);
    });
  }


  removerAtividadeCriada(index: number) {
    if (index === 0 && this.atividades.length === 1) {
      return;
    }

    this.atividades.splice(index, 1);

    this.atividades.forEach((atv, i) => {
      atv.ordem = i;
    });
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


  formularioValido(): boolean {
    if (!this.data || !this.horaInicio) {
      return false;
    }

    return this.atividades.every(atv =>
      atv.cronograma?.trim() &&
      atv.linhaFrente?.trim() &&
      atv.responsavel?.trim() &&
      Number(atv.duracao) > 0
    );
  }

  campoInvalido(campo: string): boolean {
    if (!this.camposTocados[campo]) return false;

    if (campo === 'data') {
      return !this.data;
    }
    if (campo === 'horaInicio') {
      return !this.horaInicio;
    }
    return false;
  }

  campoInvalidoAtividade(atividade: any, campo: string, index: number): boolean {
    if (!this.atividadesTocadas[index]?.[campo]) return false;

    if (campo === 'duracao') {
      return !(atividade.duracao && Number(atividade.duracao) > 0);
    }
    return !atividade[campo] || !atividade[campo].trim();
  }

  marcarTocado(campo: string) {
    this.camposTocados[campo] = true;
  }

  marcarTocadoAtividade(index: number, campo: string) {
    if (!this.atividadesTocadas[index]) {
      this.atividadesTocadas[index] = {};
    }
    this.atividadesTocadas[index][campo] = true;
  }

  adicionarAtividadeNoMeio(index: number) {
    const novaOrdem = this.atividades.length > 0 ?
      Math.max(...this.atividades.map(a => a.ordem)) + 1 : 0;

    this.atividades.splice(index, 0, {
      cronograma: '',
      linhaFrente: '',
      responsavel: '',
      duracao: 5,
      ordem: novaOrdem
    });

    this.atividades.forEach((atv, i) => {
      atv.ordem = i;
    });

    setTimeout(() => {
      const cards = document.querySelectorAll('ion-card.activity-card');

      if (cards.length > index) {
        const newCard = cards[index];

        newCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        newCard.classList.add('highlight-new');
        setTimeout(() => {
          newCard.classList.remove('highlight-new');
        }, 500);
      }
    }, 300);
  }

}
