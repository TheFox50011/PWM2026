import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css', // Asegúrate que termine en .css
})
export class AsideComponent {
  profilePicture="dummy_picture.jpeg";
}
