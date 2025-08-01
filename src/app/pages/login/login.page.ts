import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})

export class LoginPage {
  private firebaseAuth = inject(Auth);
  email = ''
  password = ''

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('tabs/home');
      }
    });
  }

  async login() {
    try {
      await this.auth.login(this.email, this.password);
    } catch (err) {
      alert('Login inválido');
    }
  }

  async loginWithGoogle() {
    try {
      await this.auth.loginWithGoogle();
    } catch (err) {
      console.error('Erro ao logar com Google:', err);
      alert('Erro ao logar com Google');
    }
  }
}