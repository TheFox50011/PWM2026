import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  imports: [
    RouterLink
  ],
  // Asegúrate que termine en .css
})
export class AsideComponent {
  profilePicture="dummy_picture.jpeg";
}
