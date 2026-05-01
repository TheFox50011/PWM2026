import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';
import usersData from '../../../../src/assets/users.json';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AsideComponent, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private route = inject(ActivatedRoute);

  id: string | null = null;
  settings: any = {
    nightmode: false,
    fontsize: 16,
    username: '',
    mail: ''
  };

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.loadSettings(this.id);
    const savedDark = localStorage.getItem('darkMode') === 'true';
    const savedFont = parseInt(localStorage.getItem('fontSize') || '16');

    this.settings.nightmode = savedDark;
    this.settings.fontsize = savedFont;

    this.applyTheme(savedDark);
    this.applyFontSize(savedFont);
  }

  loadSettings(id: string | null) {
    if (!id) return;
    const usersArray: any[] = (usersData as any).default || usersData;
    const user = usersArray.find((u: any) => u.user_id.toString() === id);
    if (user) {
      this.settings.username = user.username;
      this.settings.mail = user.email;
    }
  }

  onNightModeChange() {
    this.applyTheme(this.settings.nightmode);
    localStorage.setItem('darkMode', String(this.settings.nightmode));
  }

  onFontSizeChange() {
    this.applyFontSize(this.settings.fontsize);
    localStorage.setItem('fontSize', String(this.settings.fontsize));
  }

  private applyTheme(dark: boolean) {
    if (dark) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode'); // ← añade al <html> también
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  private applyFontSize(size: number) {
    document.documentElement.style.setProperty('font-size', size + 'px');
  }

  updateSettings() {
    this.applyTheme(this.settings.nightmode);
    this.applyFontSize(this.settings.fontsize);
    localStorage.setItem('darkMode', String(this.settings.nightmode));
    localStorage.setItem('fontSize', String(this.settings.fontsize));
    alert('Datos cambiados');
  }
}
