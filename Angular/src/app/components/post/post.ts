import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.css',
})


export class PostComponent {

  menuAbierto = false;

  togglePostMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  anadirFavoritos() {
    alert('Añadido a Favoritos');
  }

  descargarTodo() {
    alert('Descargando archivos...');
  }

  reportarPost() {
    alert('Post reportado');
  }

  profile = 'profile-photo.jpg';

}
