import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  image1="background4.PNG"
  image2="logo.png"
}
