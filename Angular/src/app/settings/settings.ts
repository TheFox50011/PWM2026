import { Component, OnInit, inject } from '@angular/core';
// Importamos ActivatedRoute para leer la URL al estilo Angular
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';
// Dependiendo de tu tsconfig, la importación de JSON suele ser así:
import usersData from '../../../../src/assets/users.json';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private route = inject(ActivatedRoute);

  id: string | null = null;
  settings: any = {
    nightmode: false,
    fontsize: 'medium',
    username: '',
    mail: ''
  };

  // ngOnInit se asegura de cargar los datos justo cuando el componente arranca
  ngOnInit() {
    // Así es como leemos un parámetro de la URL (ej: ?id=2) en Angular
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.loadSettings(this.id);
  }

  loadSettings(id: string | null) {
    if (!id) return;

    // TypeScript a veces envuelve los JSON en un objeto 'default'.
    // Aseguramos que tratamos a usersData como un array.
    const usersArray: any[] = (usersData as any).default || usersData;

    let user = usersArray.find((u: any) => u.user_id.toString() === id);

    if (user) {
      this.settings = {
        nightmode: user.Night_mode,
        fontsize: user.Font_Size,
        username: user.username,
        mail: user.email
      };

      if (this.settings.nightmode) {
        document.body.classList.add('dark-mode');
      }
    }
  }

  updateSettings() {
    alert("Se llama a la función submit con id: " + this.id);

    // Aquí podrías añadir lógica adicional como:
    // console.log("Nuevos datos:", this.settings);
  }
}
