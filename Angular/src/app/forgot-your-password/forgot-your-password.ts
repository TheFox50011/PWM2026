import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';
import { IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-your-password',
  imports: [HeaderComponent, FooterComponent, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton],
  templateUrl: './forgot-your-password.html',
  styleUrl: './forgot-your-password.css',
})
export class ForgotYourPassword {}
