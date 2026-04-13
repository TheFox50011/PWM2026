import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';

@Component({
  selector: 'app-create-forum',
  imports: [
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './create-forum.html',
  styleUrl: './create-forum.css',
})
export class CreateForum {}
