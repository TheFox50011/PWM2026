import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})

export class IndexComponent {

}
