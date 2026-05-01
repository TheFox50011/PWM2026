import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para evitar errores en el HTML

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink, CommonModule], // Añade CommonModule aquí
})
export class HeaderComponent implements OnInit {
  logo = '/logo.png'; // Asegúrate de que la ruta empiece en assets
  profilePicture: string = '/dummy_picture.jpeg';
  userName: string = 'username';

  ngOnInit(): void {
    this.loadProfileData();
  }

  async loadProfileData(): Promise<void> {
    const userId = localStorage.getItem('loggedUserId');

    try {
      // Intenta usar la ruta relativa correcta
      const response = await fetch('./assets/users.json');

      if (!response.ok) {
        throw new Error(`No se encontró el archivo: ${response.status}`);
      }

      const defaultUsers = await response.json();
      const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers') || '[]');
      const allUsers = [...defaultUsers, ...localUsers];

      // Usar == para comparar string con number si es necesario
      const currentUser = allUsers.find((u: any) => u.user_id == userId);

      if (currentUser) {
        this.userName = currentUser.username || currentUser.name;
        if (currentUser.Profile_picture) {
          // Limpia la ruta de la imagen
          this.profilePicture = currentUser.Profile_picture.replace('../', '');
        }
      }
    } catch (error) {
      console.error('Error cargando datos del header:', error);
      this.userName = 'Invitado'; // Valor por defecto si falla
    }
  }
}
