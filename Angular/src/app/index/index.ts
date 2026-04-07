import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../components/header/header.spec.js'; // Ajusta la ruta a tu componente Header
import { Footer } from '../components/footer/footer.spec.js'; // Ajusta la ruta a tu componente Footer


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, Header, Footer], // Importa los componentes aquí
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {}
