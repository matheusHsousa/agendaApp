import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonAccordionGroup,
  IonAccordion
} from '@ionic/angular/standalone';
import { NavigationService } from 'src/app/services/navigate.service';
import { MinistryService } from 'src/app/services/ministries.service';
import { EscalaService } from 'src/app/services/escala.service';

interface Escala {
  id?: string; // Firestore doc ID
  data: string; // formato ISO
  ministerio: string;
  pessoasArray: string[];
}

@Component({
  selector: 'app-escala-admin',
  templateUrl: './escala-admin.page.html',
  styleUrls: ['./escala-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonAccordionGroup,
    IonAccordion
  ],
})
export class EscalaAdminPage implements OnInit {
  tabSelecionada: 'criar' | 'visualizar' = 'criar';

  novaEscala = {
    data: '',
    ministerio: '',
    pessoas: ''
  };

  ministerios: any[] = [];
  escalas: Escala[] = [];
  editandoId: string | null = null;

  constructor(
    private navigationService: NavigationService,
    private ministryService: MinistryService,
    private escalaService: EscalaService
  ) { }

  ngOnInit() {
    // Carregar ministérios
    this.ministryService.listarMinisterios().subscribe({
      next: (dados) => {
        this.ministerios = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar ministérios:', err);
      }
    });

    this.escalaService.listarEscalas().subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          this.escalas = dados.map(e => ({
            id: e.id,
            data: e.data,
            ministerio: e.ministerio,
            pessoasArray: e.pessoasArray || []
          }));
        }
      }
    });

  }

  voltar() {
    this.navigationService.back();
  }

  async adicionarOuEditarEscala() {
    if (!this.novaEscala.data || !this.novaEscala.ministerio) return;

    const dadosEscala = {
      data: this.novaEscala.data,
      ministerio: this.novaEscala.ministerio,
      pessoasArray: this.novaEscala.pessoas
        ? this.novaEscala.pessoas.split(',').map(p => p.trim())
        : []
    };

    try {
      if (this.editandoId) {
        await this.escalaService.editarEscala(this.editandoId, dadosEscala);
        this.editandoId = null;
      } else {
        await this.escalaService.criarEscala(dadosEscala);
      }
      this.novaEscala = { data: '', ministerio: '', pessoas: '' };
      this.tabSelecionada = 'visualizar';
    } catch (err) {
      console.error('Erro ao salvar escala:', err);
    }
  }

  editarEscala(escala: Escala) {
    this.novaEscala = {
      data: escala.data,
      ministerio: escala.ministerio,
      pessoas: escala.pessoasArray.join(', ')
    };
    this.editandoId = escala.id || null;
    this.tabSelecionada = 'criar';
  }

  async removerEscala(id: string | undefined) {
    if (!id) return;
    try {
      await this.escalaService.excluirEscala(id);
    } catch (err) {
      console.error('Erro ao remover escala:', err);
    }
  }

  get escalasAgrupadas() {
    const grupos: { [data: string]: Escala[] } = {};
    for (const e of this.escalas) {
      if (!grupos[e.data]) grupos[e.data] = [];
      grupos[e.data].push(e);
    }
    const datasOrdenadas = Object.keys(grupos).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    return datasOrdenadas.map(data => ({
      data,
      escalas: grupos[data]
    }));
  }

  trackByData(index: number, item: any) {
  return item.data;
}

trackById(index: number, item: any) {
  return item.id;
}

}
