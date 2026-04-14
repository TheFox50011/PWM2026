import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [
    RouterLink
  ],
  // Asegúrate que termine en .css
})
export class HeaderComponent {
  logo= '/logo.png';
}


