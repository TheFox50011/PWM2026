/*import { Component } from '@angular/core';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css'],

})

export class CreateTest {
  protected readonly title = signal('Home');
}
*/

import { Component, signal } from '@angular/core';
import {HeaderComponent} from '../components/header/header';
import {FooterComponent} from '../components/footer/footer';

@Component({
  selector: 'app-root',
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.css'],
  imports: [
    HeaderComponent,
    FooterComponent
  ]
})

export class CreateTest {
  protected readonly title = signal('Home');
}
