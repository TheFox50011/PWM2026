import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  errorMessage: string = '';
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      //Esta linea es temporal hasta que lo conectemos con la base de datos.
      if (username === 'Example' && password === '12345678') {
        this.errorMessage = '';
        this.router.navigate(['/mainpage']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    } else {
      this.errorMessage = 'Por favor, rellena todos los campos.';
    }
  }
}
