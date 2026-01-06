import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  IonAccordion,
  IonText
} from '@ionic/angular/standalone';
import { NavigationService } from 'src/app/services/navigate.service';
import { MinistryService } from 'src/app/services/ministries.service';
import { EscalaService } from 'src/app/services/escala.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserManagementService } from 'src/app/services/user-management.service';

interface Escala {
  id?: string;
  data: string;
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
    ReactiveFormsModule,
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
    IonSegment,
    IonSegmentButton,
    IonAccordionGroup,
    IonAccordion,
    IonText
  ],
})
export class EscalaAdminPage implements OnInit {
  tabSelecionada: 'criar' | 'visualizar' = 'criar';
  escalaForm: FormGroup;

  ministerios: any[] = [];
  escalas: Escala[] = [];
  users: any[] = [];
  availableUsers: any[] = [];
  editandoId: string | null = null;
  
  userRole: string | null = null;
  userMinistryId: string | null = null;
  userMinistryName: string | null = null;
  isMinistry: boolean = false;

  constructor(
    private navigationService: NavigationService,
    private ministryService: MinistryService,
    private escalaService: EscalaService,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    private fb: FormBuilder
  ) {
    this.escalaForm = this.fb.group({
      data: ['', Validators.required],
      ministerio: ['', Validators.required],
      pessoas: [[]]
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(async user => {
      if (user) {
        this.userRole = user.role || null;
        this.userMinistryId = user.ministryId || null;
        this.userMinistryName = user.ministryName || null;
        this.isMinistry = this.userRole === 'ministry';
        
        await this.carregarDados();
      }
    });

    // quando o ministério selecionado mudar (para admins), atualiza lista de usuários disponíveis
    this.escalaForm.get('ministerio')?.valueChanges.subscribe(value => {
      // value é o nome do ministério; encontrar id correspondente
      const found = this.ministerios.find(m => m.nome === value || m.name === value);
      const id = found ? (found.id || found.uid) : null;
      this.updateAvailableUsers(id);
    });
  }

  carregarDados() {
    this.ministryService.listarMinisterios().subscribe({
      next: (dados) => {
        // Se for ministry, mostra apenas seu ministério
        if (this.isMinistry && this.userMinistryId) {
          this.ministerios = dados.filter(m => m.id === this.userMinistryId);
          
          // Pre-seleciona o ministério automaticamente
          if (this.ministerios.length > 0 && !this.editandoId) {
            this.escalaForm.patchValue({
              ministerio: this.ministerios[0].nome
            });
          }
        } else {
          // Admin e Master veem todos os ministérios
          this.ministerios = dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar ministérios:', err);
      }
    });

    this.escalaService.listarEscalas().subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          let escalasFiltradas = dados;
          
          // Se for ministry, filtra apenas escalas do seu ministério
          if (this.isMinistry && this.userMinistryName) {
            escalasFiltradas = dados.filter(e => e.ministerio === this.userMinistryName);
          }
          
          this.escalas = escalasFiltradas.map(e => ({
            id: e.id,
            data: e.data,
            ministerio: e.ministerio,
            pessoasArray: e.pessoasArray || []
          }));
        }
      }
    });

    // carregar todos os usuários e atualizar lista disponível
    this.userManagementService.listarUsuarios().subscribe({
      next: (dados) => {
        this.users = dados || [];
        // atualiza availableUsers com base no ministério do usuário atual
        const ministryIdToUse = this.userMinistryId || null;
        this.updateAvailableUsers(ministryIdToUse);
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
    });
  }

  updateAvailableUsers(ministryId: string | null) {
    if (!ministryId) {
      this.availableUsers = [];
      return;
    }

    this.availableUsers = (this.users || []).filter(u => {
      // usuário pode ter campo 'ministries' (array) ou 'ministryId'
      if (u.ministryId && u.ministryId === ministryId) return true;
      const arr = u.ministries || [];
      return arr.some((m: any) => (m.id === ministryId) || (m.uid === ministryId) || (m.nome === this.userMinistryName) || (m.name === this.userMinistryName));
    });
  }

  voltar() {
    this.navigationService.back();
  }

  async adicionarOuEditarEscala() {
    if (this.escalaForm.invalid) return;

    const formValue = this.escalaForm.value;
    const pessoasArray = Array.isArray(formValue.pessoas)
      ? formValue.pessoas.map((p: any) => (typeof p === 'string' ? p.trim() : p))
      : (formValue.pessoas ? formValue.pessoas.split(',').map((p: string) => p.trim()) : []);

    const dadosEscala = {
      data: formValue.data,
      ministerio: formValue.ministerio,
      pessoasArray
    };

    try {
      if (this.editandoId) {
        await this.escalaService.editarEscala(this.editandoId, dadosEscala);
        this.editandoId = null;
      } else {
        await this.escalaService.criarEscala(dadosEscala);
      }
      this.escalaForm.reset();
      this.tabSelecionada = 'visualizar';
      this.carregarDados(); 
    } catch (err) {
      console.error('Erro ao salvar escala:', err);
    }
  }

  editarEscala(escala: Escala) {
    this.escalaForm.setValue({
      data: escala.data,
      ministerio: escala.ministerio,
      pessoas: escala.pessoasArray || []
    });
    this.editandoId = escala.id || null;
    this.tabSelecionada = 'criar';
  }

  async removerEscala(id: string | undefined) {
    if (!id) return;
    try {
      await this.escalaService.excluirEscala(id);
      this.carregarDados();
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