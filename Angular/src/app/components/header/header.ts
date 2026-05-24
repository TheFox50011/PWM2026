import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonMenuButton, IonAvatar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonMenuButton, IonAvatar
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  profilePicture: string = '/dummy_picture.jpeg';
  userName: string = 'Invitado';
  isLoggedIn: boolean = false;
  dropdownOpen: boolean = false;

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      this.isLoggedIn = !!user;
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        this.unsubSnapshot = onSnapshot(userRef, snapshot => {
          const data = snapshot.data();
          if (data) {
            this.userName = data['username'] || user.displayName || 'Usuario';
            this.profilePicture = data['profilePicture'] || '/dummy_picture.jpeg';
          }
          this.cdr.detectChanges();
        });
      } else {
        this.userName = 'Invitado';
        this.profilePicture = '/dummy_picture.jpeg';
        this.cdr.detectChanges();
      }
    });
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.detectChanges();
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
    this.cdr.detectChanges();
  }

  navigate(path: string): void {
    this.closeDropdown();
    this.router.navigate([path]);
  }

  logout(): void {
    this.closeDropdown();
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
