import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true, // Asegúrate de que sea standalone (por defecto en Angular 17+)
  imports: [RouterLink], // 2. Agregarlo aquí
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
