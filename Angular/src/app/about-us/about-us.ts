import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent, IonContent],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  image1="background4.PNG"
  image2="logo.png"
}
