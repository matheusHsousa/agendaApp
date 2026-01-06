import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonButton, IonSelect, IonSelectOption, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { UserManagementService } from 'src/app/services/user-management.service';
import { MinistryService } from 'src/app/services/ministries.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-ministry-members',
  templateUrl: './ministry-members.page.html',
  styleUrls: ['./ministry-members.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonButton, IonIcon, IonSearchbar]
})
export class MinistryMembersPage implements OnInit {
  users: any[] = [];
  ministries: any[] = [];
  managingMinistryId: string | null = null;
  managingMinistryName: string | null = null;
  currentUser: any = null;
  searchText: string = '';

  constructor(
    private userManagementService: UserManagementService,
    private ministryService: MinistryService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private userService: UserManagementService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserData();

    if (this.currentUser) {
      if (this.currentUser.ministryId) {
        this.managingMinistryId = this.currentUser.ministryId;
        this.managingMinistryName = this.currentUser.ministryName || null;
      } else if (Array.isArray(this.currentUser.ministries) && this.currentUser.ministries.length) {
        const first = this.currentUser.ministries[0];
        this.managingMinistryId = first.id || first.uid || null;
        this.managingMinistryName = first.name || first.nome || null;
      }
    }

    this.ministryService.listarMinisterios().subscribe({
      next: (dados) => this.ministries = dados,
      error: (err) => console.error('Erro ao carregar ministérios', err)
    });

    this.userManagementService.listarUsuarios().subscribe({
      next: (dados) => {
        console.log('Usuários carregados:', dados);
        this.users = dados || [];
      },
      error: (err) => console.error('Erro ao carregar usuários', err)
    });
  }

  get sortedUsers() {
    return (this.users || []).slice().sort((a: any, b: any) => {
      const A = (a.displayName || a.email || '').toString().toLowerCase();
      const B = (b.displayName || b.email || '').toString().toLowerCase();
      return A.localeCompare(B);
    });
  }

  get filteredSortedUsers() {
    const term = (this.searchText || '').toLowerCase().trim();
    const list = (this.users || []).filter(u => {
      if (!term) return true;
      const name = (u.displayName || '').toString().toLowerCase();
      const email = (u.email || '').toString().toLowerCase();
      return name.includes(term) || email.includes(term);
    });
    return list.sort((a: any, b: any) => {
      const A = (a.displayName || a.email || '').toString().toLowerCase();
      const B = (b.displayName || b.email || '').toString().toLowerCase();
      return A.localeCompare(B);
    });
  }

  isMemberOf(user: any, ministryId: string | null) {
    if (!user || !ministryId) return false;
    const arr = user['ministries'] || [];
    return arr.some((m: any) => m.id === ministryId);
  }

  async toggleMembership(user: any, event: any) {
    if (!this.managingMinistryId || !this.managingMinistryName) return;

    try {
      if (event.detail.checked) {
        await this.userService.adicionarUsuarioAoMinisterio(user.uid, this.managingMinistryId, this.managingMinistryName);
      } else {
        await this.userService.removerUsuarioDoMinisterio(user.uid, this.managingMinistryId);
      }
      if (!user['ministries']) user['ministries'] = [];
      const exists = user['ministries'].some((m: any) => m.id === this.managingMinistryId);
      if (event.detail.checked && !exists) user['ministries'].push({ id: this.managingMinistryId, name: this.managingMinistryName });
      if (!event.detail.checked && exists) user['ministries'] = user['ministries'].filter((m: any) => m.id !== this.managingMinistryId);
    } catch (err) {
      console.error('Erro ao atualizar associação:', err);
      alert('Erro ao atualizar associação');
    }
  }

  buscarUsuarios(event: any) {
    const value = event?.detail?.value ?? '';
    this.searchText = value;
    // getter `filteredSortedUsers` usa `searchText` automaticamente
  }

  getMinistriesNames(user: any) {
    const arr = user?.ministries || [];
    return arr.map((m: any) => m.name || m.nome).join(', ');
  }

  voltar() {
    this.navigationService.back();
  }
}
