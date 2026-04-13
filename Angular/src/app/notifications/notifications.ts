import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-notifications',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {}
