import { Injectable, NgZone, inject } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference, DocumentData, getDocs, doc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
    private ngZone = inject(NgZone);  // Injeta NgZone


  constructor() { }

  async salvarSchedule(schedule: any) {
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
    }
  }
  
  listarSchedules(): Observable<any[]> {
  const schedulesRef = collection(this.firestore, 'schedules');
  return collectionData(schedulesRef, { idField: 'id' });
}



  async editarSchedule(id: string, dataAtualizada: any) {
    try {
      const scheduleDocRef = doc(this.firestore, 'schedules', id);
      await updateDoc(scheduleDocRef, dataAtualizada);
      return true;
    } catch (err) {
      console.error('Erro ao editar agendamento:', err);
      throw err;
    }
  }

  async excluirSchedule(id: string) {
    try {
      const scheduleDocRef = doc(this.firestore, 'schedules', id);
      await deleteDoc(scheduleDocRef);
      return true;
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
      throw err;
    }
  }
}
