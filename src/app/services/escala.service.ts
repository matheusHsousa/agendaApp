import { Injectable, NgZone, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  query,
  orderBy,
  where,
  getDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EscalaService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);

  constructor() {}

  async criarEscala(data: any) {
    return this.salvarEscala(data);
  }

  async salvarEscala(escala: any) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const userData = await this.authService.getCurrentUserData();
      
      const escalaData = {
        ...escala,
        uid: user.uid,
        createdBy: user.uid,
        createdByRole: userData?.role || 'user',
        ministryId: userData?.role === 'ministry' ? userData.ministryId : escala.ministryId,
        createdAt: new Date().toISOString(),
      };

      const escalasRef: CollectionReference<DocumentData> = collection(this.firestore, 'escalas');
      const docRef = await addDoc(escalasRef, escalaData);

      return docRef.id;
    } catch (err) {
      console.error('Erro ao salvar escala:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  listarEscalas(): Observable<any[]> {
    const escalasRef = collection(this.firestore, 'escalas');
    const q = query(escalasRef, orderBy('data', 'asc'));

    return new Observable((subscriber) => {
      this.loadingService.show();
      this.ngZone.run(() => {
        collectionData(q, { idField: 'id' }).subscribe({
          next: (data) => {
            subscriber.next(data);
            this.loadingService.hide();
          },
          error: (err) => {
            this.loadingService.hide();
            subscriber.error(err);
          },
          complete: () => {
            this.loadingService.hide();
            subscriber.complete();
          }
        });
      });
    });
  }

  // Lista escalas filtradas por ministério (para usuários com role ministry)
  async listarEscalasPorMinisterio(ministryId: string): Promise<any[]> {
    this.loadingService.show();
    try {
      const escalasRef = collection(this.firestore, 'escalas');
      const q = query(
        escalasRef, 
        where('ministryId', '==', ministryId),
        orderBy('data', 'asc')
      );

      return new Promise((resolve, reject) => {
        this.ngZone.run(() => {
          collectionData(q, { idField: 'id' }).subscribe({
            next: (data) => {
              this.loadingService.hide();
              resolve(data);
            },
            error: (err) => {
              this.loadingService.hide();
              reject(err);
            }
          });
        });
      });
    } catch (err) {
      this.loadingService.hide();
      throw err;
    }
  }

  // Lista escalas baseado no role do usuário
  async listarEscalasPorRole(): Promise<any[]> {
    const userData = await this.authService.getCurrentUserData();
    
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    // Master e Admin veem todas as escalas
    if (userData.role === 'master' || userData.role === 'admin') {
      return new Promise((resolve, reject) => {
        this.listarEscalas().subscribe({
          next: (escalas) => resolve(escalas),
          error: (err) => reject(err)
        });
      });
    }

    // Ministry vê apenas as escalas do seu ministério
    if (userData.role === 'ministry' && userData.ministryId) {
      return this.listarEscalasPorMinisterio(userData.ministryId);
    }

    // Usuário comum vê todas (ou você pode restringir)
    return new Promise((resolve, reject) => {
      this.listarEscalas().subscribe({
        next: (escalas) => resolve(escalas),
        error: (err) => reject(err)
      });
    });
  }

  async editarEscala(id: string, dataAtualizada: any) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const escalaDocRef = doc(this.firestore, 'escalas', id);
      await updateDoc(escalaDocRef, dataAtualizada);
      return true;
    } catch (err) {
      console.error('Erro ao editar escala:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async excluirEscala(id: string) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const escalaDocRef = doc(this.firestore, 'escalas', id);
      await deleteDoc(escalaDocRef);
      return true;
    } catch (err) {
      console.error('Erro ao excluir escala:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }
}