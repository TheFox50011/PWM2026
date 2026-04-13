import { Component } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-forgot-your-password',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './forgot-your-password.html',
  styleUrl: './forgot-your-password.css',
})
export class ForgotYourPassword {}
