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
  getDocs,
  where,
  getDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);

  constructor() { }


  async criarCronograma(dataEvento: string, horaInicio: string, atividades: any[]) {
    // Verifica se já existe cronograma para esta data
    const cronogramasExistentes = await this.obterCronogramasPorData(dataEvento);

    if (cronogramasExistentes && cronogramasExistentes.length > 0) {
      // Verifica conflitos com cada cronograma existente
      for (const cronogramaExistente of cronogramasExistentes) {
        if (this.verificarConflitos(horaInicio, cronogramaExistente.atividades)) {
          throw new Error('O horário de início conflita com atividades existentes');
        }
      }
    }

    // Calcula horários automáticos
    const atividadesComHorario = this.calcularHorarios(horaInicio, atividades);

    const cronogramaData = {
      data: dataEvento,
      horaInicio,
      atividades: atividadesComHorario
    };

    return this.salvarCronograma(cronogramaData);
  }

  public verificarConflitos(novoHorarioInicio: string, atividadesExistente: any[]): boolean {
    if (!atividadesExistente || atividadesExistente.length === 0) return false;

    // Extrai horas e minutos do novo horário
    const [novaHora, novoMinuto] = novoHorarioInicio.split(':').map(Number);

    // Converte para minutos totais para facilitar comparação
    const novoHorarioEmMinutos = novaHora * 60 + novoMinuto;

    // Pega o primeiro e último horário existente
    const primeiroHorario = atividadesExistente[0].horario;
    const ultimoHorario = atividadesExistente[atividadesExistente.length - 1].horario;

    const [primeiraHora, primeiroMinuto] = primeiroHorario.split(':').map(Number);
    const [ultimaHora, ultimoMinuto] = ultimoHorario.split(':').map(Number);

    const primeiroHorarioEmMinutos = primeiraHora * 60 + primeiroMinuto;
    const ultimoHorarioEmMinutos = ultimaHora * 60 + ultimoMinuto;

    // Verifica se o novo horário está dentro do intervalo existente
    return novoHorarioEmMinutos >= primeiroHorarioEmMinutos &&
      novoHorarioEmMinutos <= ultimoHorarioEmMinutos;
  }

  public async obterCronogramasPorData(data: string): Promise<any[]> {
    try {
      const ref = collection(this.firestore, 'cronogramas');
      const q = query(ref, where('data', '==', data));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Erro ao buscar cronogramas por data:', err);
      return [];
    }
  }

  public calcularHorarios(horaInicio: string, atividades: any[]) {
    console.group('[Service] calcularHorarios');
    console.log('Input:', { horaInicio, atividades: JSON.parse(JSON.stringify(atividades)) });

    let [hora, minuto] = horaInicio.split(':').map(Number);
    const lista = [];

    for (const atv of atividades) {
      const horarioFormatado = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
      lista.push({
        ...atv,
        horario: horarioFormatado
      });

      minuto += atv.duracao || 0;
      while (minuto >= 60) {
        minuto -= 60;
        hora++;
      }

      console.log(`Atividade ${atv.ordem} -> Horário: ${horarioFormatado} | Próximo: ${hora}:${minuto}`);
    }

    console.log('Resultado:', JSON.parse(JSON.stringify(lista)));
    console.groupEnd();
    return lista;
  }

  private async salvarCronograma(cronograma: any) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const dataToSave = {
        ...cronograma,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      };

      const ref: CollectionReference<DocumentData> = collection(this.firestore, 'cronogramas');
      const docRef = await addDoc(ref, dataToSave);

      return docRef.id;
    } catch (err) {
      console.error('Erro ao salvar cronograma:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

 listarCronogramas(): Observable<any[]> {
    const ref = collection(this.firestore, 'cronogramas');
    const q = query(ref, orderBy('data', 'asc'));

    this.loadingService.show();
    
    return new Observable<any[]>(subscriber => {
      const sub = collectionData(q, { idField: 'id' }).subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.loadingService.hide();
            subscriber.next(data);
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.loadingService.hide();
            subscriber.error(err);
          });
        },
        complete: () => {
          this.ngZone.run(() => {
            this.loadingService.hide();
            subscriber.complete();
          });
        }
      });

      return () => sub.unsubscribe();
    });
  }

  async editarCronograma(id: string, dataAtualizada: any) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      if (dataAtualizada.atividades && dataAtualizada.horaInicio) {
        dataAtualizada.atividades = this.calcularHorarios(
          dataAtualizada.horaInicio,
          dataAtualizada.atividades
        );
      }

      const docRef = doc(this.firestore, 'cronogramas', id);
      await updateDoc(docRef, {
        ...dataAtualizada,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err) {
      console.error('Erro ao editar cronograma:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async excluirCronograma(id: string) {
    this.loadingService.show();
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const docRef = doc(this.firestore, 'cronogramas', id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('Erro ao excluir cronograma:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async reordenarAtividades(cronogramaId: string, horaInicio: string, atividades: any[]) {
    this.loadingService.show();
    try {
      // Primeiro calcula os novos horários
      const atividadesAtualizadas = this.calcularHorarios(horaInicio, atividades);

      // Atualiza no Firestore
      const docRef = doc(this.firestore, 'cronogramas', cronogramaId);
      await updateDoc(docRef, {
        atividades: atividadesAtualizadas,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (err) {
      console.error('Erro ao reordenar atividades:', err);
      throw err;
    } finally {
      this.loadingService.hide();
    }
  }

  async obterCronogramaPorId(id: string): Promise<any> {
  const docRef = doc(this.firestore, 'cronogramas', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Cronograma não encontrado');
  }
}
}
