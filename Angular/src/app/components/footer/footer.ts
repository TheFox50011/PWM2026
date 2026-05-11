import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonFooter, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IonFooter, IonToolbar, IonTitle, IonButtons, IonButton],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})

export class FooterComponent{
  logo = '/logo.png';
}
