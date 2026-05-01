import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {}
