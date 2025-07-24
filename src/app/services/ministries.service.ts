import { Injectable, inject, NgZone } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);

  private collectionRef: CollectionReference<DocumentData> = collection(this.firestore, 'ministries');

  constructor() { }

  listarMinisterios(): Observable<any[]> {
    return new Observable((subscriber) => {
      this.loadingService.show();
      this.ngZone.run(() => {
        collectionData(this.collectionRef, { idField: 'id' }).subscribe({
          next: (data) => {
            subscriber.next(data);
            this.loadingService.hide(); // Oculta após o primeiro sucesso
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

  async criarMinisterio(data: any) {
    this.loadingService.show();
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Erro ao criar ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async atualizarMinisterio(id: string, dataAtualizada: any) {
    this.loadingService.show();
    try {
      return await this.ngZone.run(async () => {
        const docRef = doc(this.firestore, 'ministries', id);
        await updateDoc(docRef, dataAtualizada);
        return true;
      });
    } catch (err) {
      console.error('Erro ao atualizar ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async deletarMinisterio(id: string) {
    this.loadingService.show();
    try {
      return await this.ngZone.run(async () => {
        const docRef = doc(this.firestore, 'ministries', id);
        await deleteDoc(docRef);
        return true;
      });
    } catch (err) {
      console.error('Erro ao deletar ministério:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }
}
