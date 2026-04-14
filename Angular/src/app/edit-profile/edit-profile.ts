import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-edit-profile',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {}
