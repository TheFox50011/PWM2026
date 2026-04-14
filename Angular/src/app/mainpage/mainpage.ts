import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';
import {AsideComponent} from '../components/sidebar/sidebar';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-mainpage',
  imports: [
    FooterComponent,
    HeaderComponent,
    AsideComponent,
    RouterLink
  ],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
})
export class Mainpage {}
