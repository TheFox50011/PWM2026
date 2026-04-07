import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrls: ['./index.css'] // Prueba con la sintaxis de array
})

export class IndexComponent {
  ngOnInit() {
    //window.xLuIncludeFile(); // Solo si la función existe globalmente
  }
}
