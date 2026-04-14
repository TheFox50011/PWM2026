import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly LoginComponent = LoginComponent;
}

export class LoginComponent {
  // Inyectamos las herramientas que necesitamos
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Variable para guardar el mensaje de error
  errorMessage: string = '';

  // Creamos el formulario con validaciones básicas
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    // Verificamos que el usuario no envíe el formulario vacío
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Comprobamos las credenciales de tu Sprint 2
      if (username === 'Example' && password === '12345678') {
        // ¡Éxito! Limpiamos el error y navegamos a la página principal
        this.errorMessage = '';
        this.router.navigate(['/mainpage']);
      } else {
        // Fallo: Mostramos el aviso
        this.errorMessage = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    } else {
      // Si le da a entrar sin rellenar los datos
      this.errorMessage = 'Por favor, rellena todos los campos.';
    }
  }
}
