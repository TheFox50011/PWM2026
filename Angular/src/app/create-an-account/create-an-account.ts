import { Component, inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-an-account',
  standalone: true, // Asegúrate de que sea standalone si usas imports aquí
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './create-an-account.html',
  styleUrl: './create-an-account.css',
})

export class CreateAnAccount {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  errorMessage: string = '';

  // Definimos el formulario con sus validaciones
  formAccount: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  handleRegister() {
    this.errorMessage = ''; // Limpiamos errores previos

    if (this.formAccount.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente.';
      return;
    }

    const password = this.formAccount.get('password')?.value;
    const repeatPassword = this.formAccount.get('repeatPassword')?.value;

    if (password !== repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    console.log("Datos del registro:", this.formAccount.value);
  }
}
