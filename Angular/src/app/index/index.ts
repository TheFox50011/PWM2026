import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, IonContent, IonButton],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})

export class IndexComponent {
  backStyle= "url('libros.png')"
}
