import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  errorMessage: string = '';
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit() {
    signOut(this.auth);
  }
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    const { username, password } = this.loginForm.value;

    try {
      // 1. Busca el email asociado al username en Firestore
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('username', '==', username));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        this.errorMessage = 'Usuario no encontrado.';
        return;
      }

      const email = snapshot.docs[0].data()['email'];

      // 2. Login con Firebase Auth usando el email encontrado
      await signInWithEmailAndPassword(this.auth, email, password);

      this.errorMessage = '';
      this.router.navigate(['/mainpage']);

    } catch (error: any) {
      console.error('Error en login:', error);
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
