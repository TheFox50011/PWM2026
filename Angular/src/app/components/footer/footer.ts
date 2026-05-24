import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonFooter, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IonFooter, IonToolbar],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  logo = '/logo.png';
}
