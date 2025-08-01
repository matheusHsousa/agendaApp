import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    doc,
    getDoc,
    setDoc,
    DocumentReference,
    DocumentData
} from '@angular/fire/firestore';
import { User as FirebaseUser } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
    private firestore = inject(Firestore);

    async upsertUser(user: FirebaseUser): Promise<void> {
        const userRef = this.getUserDocRef();
        const snap = await getDoc(userRef);

        const userData: any = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString(),
        };

        if (!snap.exists()) {
            await setDoc(userRef, {
                ...userData,
                role: 'user',
                createdAt: new Date().toISOString()
            });
        } else {
            await setDoc(userRef, {
                ...userData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }
    }

    // Obtém a role do usuário
    async getUserRole(): Promise<string> {
        const snap = await getDoc(this.getUserDocRef());
        if (snap.exists()) {
            const data = snap.data();
            return data['role'] || 'user';
        }
        return 'user';
    }

    // Obtém os dados completos do usuário
    async getUser(): Promise<any | null> {
        const snap = await getDoc(this.getUserDocRef());
        return snap.exists() ? snap.data() : null;
    }

    private getUserDocRef(): DocumentReference<DocumentData> {
        return doc(this.firestore, `users/${this.getUserUidFromCache()}`);
    }

    getUserUidFromCache(): string | null {
        const data = localStorage.getItem('cachedUser');
        if (!data) return null;

        try {
            const parsed = JSON.parse(data);
            return parsed.uid || null;
        } catch (e) {
            return null;
        }
    }

}
