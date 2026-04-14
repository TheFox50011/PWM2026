import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import {AsideComponent} from '../components/sidebar/sidebar';
import {FormsModule} from '@angular/forms';
import * as users from '../../../../src/assets/users.json'

@Component({
  selector: 'app-settings',
  imports: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
   loadSettings(id: string | null) {
      if (id == null || id === '') {
        return {
          nightmode: null,
          fontsize: null,
          username: null,
          mail: null
        };
      }
      let user = users.find(user => user.user_id.toString() === id);
      if (!user) {
        return {
          nightmode: null,
          fontsize: null,
          username: null,
          mail: null
        };
      }
      return {
      nightmode: user.Night_mode,
      fontsize: user.Font_Size,
      username: user.username,
      mail: user.email
    }
  }
  updateSettings(id: string | null) {
     alert("Se llama a la función submit con id" + id)
     return null
  }
  id= new URLSearchParams(window.location.search).get('id')
  settings = {
     nightmode: null,
    fontsize: null,
    username: null,
    mail: null
  }
  ///settings =  this.loadSettings(this.id);
  protected readonly URLSearchParams = URLSearchParams;
  protected readonly window = window;
}
