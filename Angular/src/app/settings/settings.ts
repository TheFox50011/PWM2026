import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import {AsideComponent} from '../components/sidebar/sidebar';

@Component({
  selector: 'app-settings',
  imports: [
    HeaderComponent,
    FooterComponent,
    AsideComponent
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {}
