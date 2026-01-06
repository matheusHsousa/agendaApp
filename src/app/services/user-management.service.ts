import { Injectable, inject, NgZone } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserRole, UserData } from '../models/user.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);

  constructor() { }

  listarUsuarios(): Observable<UserData[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<UserData[]>;
  }

  // Adiciona um ministério ao campo 'ministries' do usuário (array)
  async adicionarUsuarioAoMinisterio(uid: string, ministryId: string, ministryName: string) {
    this.loadingService.show();
    try {
      return await this.ngZone.run(async () => {
        const userRef = doc(this.firestore, 'users', uid);
        await updateDoc(userRef, {
          ministries: arrayUnion({ id: ministryId, name: ministryName }),
          updatedAt: new Date().toISOString()
        });
        return true;
      });
    } catch (err) {
      console.error('Erro ao adicionar usuário ao ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  // Remove um ministério do campo 'ministries' do usuário (array)
  async removerUsuarioDoMinisterio(uid: string, ministryId: string) {
    this.loadingService.show();
    try {
      return await this.ngZone.run(async () => {
        const userRef = doc(this.firestore, 'users', uid);
        // Para remover, precisamos passar o objeto exato salvo; assumimos que apenas id e name foram salvos,
        // então fazemos uma leitura rápida e removemos o item correspondente.
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data: any = snap.data();
          const ministries: any[] = data['ministries'] || [];
          const target = ministries.find(m => m.id === ministryId);
          if (target) {
            await updateDoc(userRef, {
              ministries: arrayRemove(target),
              updatedAt: new Date().toISOString()
            });
          }
        }
        return true;
      });
    } catch (err) {
      console.error('Erro ao remover usuário do ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  // Atualiza o role de um usuário
  async atualizarRole(uid: string, role: UserRole, ministryId?: string, ministryName?: string) {
    this.loadingService.show();
    try {
      return await this.ngZone.run(async () => {
        const userRef = doc(this.firestore, 'users', uid);
        const updateData: any = {
          role,
          updatedAt: new Date().toISOString()
        };

        // Se for role de ministério, adiciona o ministryId
        if (role === 'ministry' && ministryId) {
          updateData.ministryId = ministryId;
          updateData.ministryName = ministryName;
        } else {
          // Remove ministryId se não for role de ministério
          updateData.ministryId = null;
          updateData.ministryName = null;
        }

        await updateDoc(userRef, updateData);
        return true;
      });
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  // Obtém dados de um usuário específico
  async obterUsuario(uid: string): Promise<UserData | null> {
    this.loadingService.show();
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() } as UserData;
      }
      return null;
    } catch (err) {
      console.error('Erro ao obter usuário:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  // Lista usuários por role
  async listarUsuariosPorRole(role: UserRole): Promise<UserData[]> {
    this.loadingService.show();
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('role', '==', role));
      const snapshot = await getDocs(q);
      
      const usuarios: UserData[] = [];
      snapshot.forEach((doc) => {
        usuarios.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      
      return usuarios;
    } catch (err) {
      console.error('Erro ao listar usuários por role:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  // Lista usuários de um ministério específico
  async listarUsuariosPorMinisterio(ministryId: string): Promise<UserData[]> {
    this.loadingService.show();
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('ministryId', '==', ministryId));
      const snapshot = await getDocs(q);
      
      const usuarios: UserData[] = [];
      snapshot.forEach((doc) => {
        usuarios.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      
      return usuarios;
    } catch (err) {
      console.error('Erro ao listar usuários por ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }
}
