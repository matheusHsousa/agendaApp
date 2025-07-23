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

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);  // Injeta NgZone

  private collectionRef: CollectionReference<DocumentData> = collection(this.firestore, 'ministries');

  constructor() { }

  listarMinisterios(): Observable<any[]> {
    return new Observable((subscriber) => {
      this.ngZone.run(() => {
        collectionData(this.collectionRef, { idField: 'id' }).subscribe({
          next: (data) => subscriber.next(data),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
      });
    });
  }

  async criarMinisterio(data: any) {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Erro ao criar ministério:', err);
      throw err;
    }
  }


  async atualizarMinisterio(id: string, dataAtualizada: any) {
    try {
      return await this.ngZone.run(async () => {
        const docRef = doc(this.firestore, 'ministries', id);
        await updateDoc(docRef, dataAtualizada);
        return true;
      });
    } catch (err) {
      console.error('Erro ao atualizar ministério:', err);
      throw err;
    }
  }

  async deletarMinisterio(id: string) {
    try {
      return await this.ngZone.run(async () => {
        const docRef = doc(this.firestore, 'ministries', id);
        await deleteDoc(docRef);
        return true;
      });
    } catch (err) {
      console.error('Erro ao deletar ministério:', err);
      throw err;
    }
  }
}
