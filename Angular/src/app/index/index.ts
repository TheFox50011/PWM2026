import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// Importamos los componentes reales, no los .spec
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './index.html',
  styleUrls: ['./index.css'] // Prueba con la sintaxis de array
})

export class Index {
  // Si necesitas ejecutar la función xLuIncludeFile, hazlo aquí:
  ngOnInit() {
    // window.xLuIncludeFile(); // Solo si la función existe globalmente
  }
}
