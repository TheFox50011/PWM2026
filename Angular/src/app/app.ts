import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular');
  ngOnInit() {
    const dark = localStorage.getItem('darkMode') === 'true';
    const font = parseInt(localStorage.getItem('fontSize') || '16');

    if (dark) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode'); // ← añade esto
    }
    document.documentElement.style.setProperty('font-size', font + 'px');
  }
}
