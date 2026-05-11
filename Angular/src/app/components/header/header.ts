import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonMenuButton, IonContent, IonPopover, IonList, IonItem, IonLabel, IonAvatar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink, CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonMenuButton, IonContent, IonPopover, IonList, IonItem, IonLabel, IonAvatar
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  logo = '/logo.png';
  profilePicture: string = '/dummy_picture.jpeg';
  userName: string = 'Invitado';

  isLoggedIn: boolean = false;

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

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }

  logout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
