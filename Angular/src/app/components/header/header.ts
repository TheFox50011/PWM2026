import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css', // Asegúrate que termine en .css
})
export class HeaderComponent {
  logo= '/logo.png';
}


