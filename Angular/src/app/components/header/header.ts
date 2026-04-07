import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, Header, FooterComponent],
  templateUrl: './index.html',
  styleUrl: './index.css', // Asegúrate que termine en .css
})
export class IndexComponent {}
