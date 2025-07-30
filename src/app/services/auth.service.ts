import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  GoogleAuthProvider,
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
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FirebaseError } from '@angular/fire/app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  user$ = this.currentUserSubject.asObservable();

  constructor(private iab: InAppBrowser) {
    const cachedUser = this.getCachedUser();

    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }

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
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    await this.updateUserData(result.user);
    this.router.navigateByUrl('/home');
  }

  async loginWithGoogle() {
    try {
      if (Capacitor.isNativePlatform()) {
        await this.handleNativeGoogleLogin();
      } else {
        await this.handleWebGoogleLogin();
      }
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      console.error('Erro no login com Google:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  private async handleNativeGoogleLogin() {
    await GoogleAuth.initialize();
    const googleUser = await GoogleAuth.signIn();

    if (!googleUser?.authentication?.idToken) {
      throw new Error('Token de autenticação não recebido do Google');
    }

    const credential = GoogleAuthProvider.credential(
      googleUser.authentication.idToken,
      googleUser.authentication.accessToken
    );

    const result = await signInWithCredential(this.auth, credential);
    await this.updateUserData(result.user);
    this.router.navigateByUrl('/home');
  }

  private async handleWebGoogleLogin() {
    const provider = new GoogleAuthProvider();

    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    if (isMobile) {
      await signInWithRedirect(this.auth, provider);
    } else {
      const result = await signInWithPopup(this.auth, provider);
      await this.updateUserData(result.user);
      this.router.navigateByUrl('/home');
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
      return `Erro Firebase: ${error.code} - ${error.message}`;
    } else if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return 'Ocorreu um erro desconhecido durante o login com Google';
  }

  private async updateUserData(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(userRef);

    const userData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
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

  logout() {
    signOut(this.auth);
    this.clearCachedUser();
    this.router.navigateByUrl('/login');
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
