import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';

@Component({
  selector: 'app-favorites',
  imports: [
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {}
