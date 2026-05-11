import { Component } from '@angular/core';
import {FooterComponent} from '../components/footer/footer';
import {HeaderComponent} from '../components/header/header';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-our-team',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    IonContent
  ],
  templateUrl: './our-team.html',
  styleUrl: './our-team.css',
})
export class OurTeam {
  cathy="/cathy.png"
  diego="/diego.png"
  saul="/saul.png"
}
