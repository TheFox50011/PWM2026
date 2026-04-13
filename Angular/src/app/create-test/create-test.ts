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

@Component({
  selector: 'app-root',
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.css'],
})

export class CreateTest {
  protected readonly title = signal('Home');
}
