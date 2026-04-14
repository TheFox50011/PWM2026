import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';

@Component({
  selector: 'app-do-test',
  imports: [
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './do-test.html',
  styleUrl: './do-test.css',
})
export class DoTest {}
