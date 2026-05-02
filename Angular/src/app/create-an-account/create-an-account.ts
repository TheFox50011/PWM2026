import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-an-account',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './create-an-account.html',
  styleUrl: './create-an-account.css',
})
export class CreateAnAccount {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  errorMessage: string = '';

  formAccount: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  async handleRegister() {
    this.errorMessage = '';

    if (this.formAccount.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente.';
      return;
    }

    const { email, name, surname, username, password, repeatPassword } = this.formAccount.value;

    if (password !== repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      // 1. Crea el usuario en Firebase Auth
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = credential.user;

      // 2. Guarda el displayName
      await updateProfile(user, { displayName: username });

      // 3. Guarda todos los datos en Firestore
      await setDoc(doc(this.firestore, `users/${user.uid}`), {
        email,
        name,
        surname,
        username,
        role: 'user',
        profilePicture: '',
        followers: '0',
        following: '0',
        biography: '',
        link1: '',
        link2: ''
      });

      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Este email ya está registrado.';
      } else {
        this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      }
    }
  }
}
