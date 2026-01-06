import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonChip,
  IonIcon,
  IonSearchbar,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { UserManagementService } from '../../../../services/user-management.service';
import { MinistryService } from '../../../../services/ministries.service';
import { UserRole, UserData, MinistryData } from '../../../../models/user.model';
import { addIcons } from 'ionicons';
import { personCircleOutline, shieldCheckmarkOutline, briefcaseOutline, keyOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonChip,
    IonIcon,
    IonSearchbar,
    IonButtons,
    IonBackButton
  ]
})
export class UserManagementPage implements OnInit {
  private userManagementService = inject(UserManagementService);
  private ministryService = inject(MinistryService);

  usuarios: UserData[] = [];
  usuariosFiltrados: UserData[] = [];
  ministerios: MinistryData[] = [];
  loading = false;
  searchText = '';

  constructor() {
    addIcons({ personCircleOutline, shieldCheckmarkOutline, briefcaseOutline, keyOutline, peopleOutline });
  }

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    this.loading = true;
    try {
      this.userManagementService.listarUsuarios().subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.usuariosFiltrados = usuarios;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });

      // Carrega ministérios
      this.ministryService.listarMinisterios().subscribe({
        next: (ministerios) => {
          this.ministerios = ministerios;
        },
        error: (err) => {
        }
      });
    } catch (error) {
      this.loading = false;
    }
  }

  async atualizarRole(usuario: UserData, novoRole: UserRole, ministryId?: string) {
    try {
      const ministry = ministryId ? this.ministerios.find(m => m.id === ministryId) : undefined;
      await this.userManagementService.atualizarRole(
        usuario.uid,
        novoRole,
        ministryId,
        ministry?.nome
      );
      
      usuario.role = novoRole;
      if (novoRole === 'ministry' && ministryId) {
        usuario.ministryId = ministryId;
        usuario.ministryName = ministry?.nome;
      } else {
        usuario.ministryId = undefined;
        usuario.ministryName = undefined;
      }
    } catch (error) {
    }
  }

  onRoleChange(usuario: UserData, event: any) {
    const novoRole = event.detail.value as UserRole;
    
    if (novoRole === 'ministry' && !usuario.ministryId) {
      return;
    }
    
    this.atualizarRole(usuario, novoRole, usuario.ministryId);
  }

  onMinistryChange(usuario: UserData, event: any) {
    const ministryId = event.detail.value;
    this.atualizarRole(usuario, 'ministry', ministryId);
  }

  buscarUsuarios(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.searchText = searchTerm;

    if (!searchTerm) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.email?.toLowerCase().includes(searchTerm) ||
      usuario.displayName?.toLowerCase().includes(searchTerm)
    );
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case 'master':
        return 'key-outline';
      case 'Admin':
        return 'shield-checkmark-outline';
      case 'ministry':
        return 'briefcase-outline';
      default:
        return 'person-circle-outline';
    }
  }

  getRoleColor(role: UserRole): string {
    switch (role) {
      case 'master':
        return 'danger';
      case 'Admin':
        return 'warning';
      case 'ministry':
        return 'primary';
      default:
        return 'medium';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'master':
        return 'Master';
      case 'Admin':
        return 'Administrador';
      case 'ministry':
        return 'Ministério';
      default:
        return 'Usuário';
    }
  }
}
