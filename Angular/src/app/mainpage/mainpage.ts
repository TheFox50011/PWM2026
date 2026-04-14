import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';
import {AsideComponent} from '../components/sidebar/sidebar';

@Component({
  selector: 'app-mainpage',
  imports: [
    FooterComponent,
    HeaderComponent,
    AsideComponent
  ],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
})
export class Mainpage {}
