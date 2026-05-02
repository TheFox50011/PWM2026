import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth, authState, updateEmail } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AsideComponent, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;
  private uid: string = '';

  settings: any = {
    fontsize: 16,
    username: '',
    mail: ''
  };

  ngOnInit() {
    const savedFont = parseInt(localStorage.getItem('fontSize') || '16');
    this.settings.fontsize = savedFont;
    this.applyFontSize(savedFont);

    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      if (user) {
        this.uid = user.uid;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        this.unsubSnapshot = onSnapshot(userRef, snapshot => {
          const data = snapshot.data();
          if (data) {
            this.settings.username = data['username'] || '';
            this.settings.mail = data['email'] || user.email || '';
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  onFontSizeChange() {
    this.applyFontSize(this.settings.fontsize);
    localStorage.setItem('fontSize', String(this.settings.fontsize));
  }

  private applyFontSize(size: number) {
    document.documentElement.style.setProperty('font-size', size + 'px');
  }

  async updateSettings() {
    if (!this.uid) return;
    try {
      const userRef = doc(this.firestore, `users/${this.uid}`);
      await updateDoc(userRef, {
        username: this.settings.username,
        email: this.settings.mail,
      });
      this.applyFontSize(this.settings.fontsize);
      localStorage.setItem('fontSize', String(this.settings.fontsize));
      alert('Datos cambiados');
    } catch (e) {
      console.error(e);
      alert('Error al guardar los cambios');
    }
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
