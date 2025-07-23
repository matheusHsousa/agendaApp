import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  user$ = this.currentUserSubject.asObservable();

  constructor() {
    const cachedUser = this.getCachedUser();
    if (cachedUser) {
      this.currentUserSubject.next(cachedUser);
    }

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const role = await this.loadUserRole(user.uid);
        const userWithRole = { ...user, role };
        this.currentUserSubject.next(userWithRole);
        this.setCachedUser(userWithRole);
      } else {
        this.currentUserSubject.next(null);
        this.clearCachedUser();
        this.router.navigateByUrl('/login');
      }
    });
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigateByUrl('/home');
  }

  async loginWithGoogle() {
    const isNative = Capacitor.getPlatform() !== 'web';

    let userCredential;

    if (isNative) {
      const googleUser = await GoogleAuth.signIn();
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      userCredential = await signInWithCredential(this.auth, credential);
    } else {
      const provider = new GoogleAuthProvider();
      userCredential = await signInWithPopup(this.auth, provider);
    }

    // Criação do usuário no Firestore, se necessário
    const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: userCredential.user.email,
        role: 'user'
      });
    }

    this.router.navigateByUrl('/home');
  }

  logout() {
    signOut(this.auth);
    this.clearCachedUser();
  }

  get isLoggedIn(): boolean {
    return this.auth.currentUser != null;
  }

  private async loadUserRole(uid: string): Promise<string> {
    try {
      const userDoc = doc(this.firestore, `users/${uid}`);
      const snap = await getDoc(userDoc);
      if (snap.exists()) {
        const data = snap.data();
        return data['role'] || 'user';
      } else {
        return 'user';
      }
    } catch (error) {
      console.error('Erro ao carregar role:', error);
      return 'user';
    }
  }

  private setCachedUser(user: any) {
    const userData = {
      uid: user.uid,
      email: user.email,
      role: user.role
    };
    localStorage.setItem('cachedUser', JSON.stringify(userData));
  }

  private getCachedUser(): any | null {
    const data = localStorage.getItem('cachedUser');
    return data ? JSON.parse(data) : null;
  }

  private clearCachedUser() {
    localStorage.removeItem('cachedUser');
  }
}
