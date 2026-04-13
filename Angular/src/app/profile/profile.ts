import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import {NONE_TYPE} from '@angular/compiler';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  profilePicture=null
}
