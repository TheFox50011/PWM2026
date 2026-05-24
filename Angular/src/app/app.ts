import {Component, signal} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AsideComponent } from './components/sidebar/sidebar';


@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet, AsideComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular');

}
