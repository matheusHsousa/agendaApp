import { Injectable, NgZone, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
  DocumentData,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  collectionData
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);

  constructor() {}

  async salvarSchedule(schedule: any) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) return;

      const scheduleData = {
        ...schedule,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      };

      const schedulesRef: CollectionReference<DocumentData> = collection(this.firestore, 'schedules');
      const docRef = await addDoc(schedulesRef, scheduleData);

      return docRef.id;
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  listarSchedules(): Observable<any[]> {
    const schedulesRef = collection(this.firestore, 'schedules');

    return new Observable((subscriber) => {
      this.loadingService.show();
      collectionData(schedulesRef, { idField: 'id' }).subscribe({
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
  }

  async editarSchedule(id: string, dataAtualizada: any) {
    this.loadingService.show();
    try {
      const scheduleDocRef = doc(this.firestore, 'schedules', id);
      await updateDoc(scheduleDocRef, dataAtualizada);
      return true;
    } catch (err) {
      console.error('Erro ao editar agendamento:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async excluirSchedule(id: string) {
    this.loadingService.show();
    try {
      const scheduleDocRef = doc(this.firestore, 'schedules', id);
      await deleteDoc(scheduleDocRef);
      return true;
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }
}
