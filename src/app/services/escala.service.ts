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
  orderBy
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class EscalaService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
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

      const escalaData = {
        ...escala,
        uid: user.uid,
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