import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  profilePicture: string = 'assets/dummy_picture.jpeg';
  userName: string = 'Cargando...';
  followers: string = '0';
  following: string = '0';
  email: string = '';
  biography: string = '';
  link1: string = '';
  link2: string = '';

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        this.unsubSnapshot = onSnapshot(userRef, snapshot => {
          const data = snapshot.data();
          if (data) {
            this.userName = data['username'] || user.displayName || 'Usuario';
            this.email = data['email'] || user.email || '';
            this.followers = data['followers'] || '0';
            this.following = data['following'] || '0';
            this.biography = data['biography'] || '';
            this.link1 = data['link1'] || '';
            this.link2 = data['link2'] || '';
            this.profilePicture = data['profilePicture'] || 'assets/dummy_picture.jpeg';
          }
        });
      } else {
        this.userName = 'No has iniciado sesión';
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
