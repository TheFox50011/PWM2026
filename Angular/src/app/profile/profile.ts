import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import {NONE_TYPE} from '@angular/compiler';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  profilePicture=null
}
