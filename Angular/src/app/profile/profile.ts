import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot, collection, query, where, getDocs, orderBy } from '@angular/fire/firestore';
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
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  profilePicture: string = '';
  userName: string = '';
  followers: string = '0';
  following: string = '0';
  email: string = '';
  biography: string = '';
  link1: string = '';
  link2: string = '';
  sharedFiles: any[] = [];
  sharedTests: any[] = [];
  sharedForums: any[] = [];

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
            this.profilePicture = data['profilePicture'] || '';
            this.sharedFiles = data['sharedFiles'] || [];
          }
          this.cdr.detectChanges();
        });

        this.loadUserTests(user.uid);
        this.loadUserForums(user.uid);
      } else {
        this.userName = 'No has iniciado sesión';
        this.cdr.detectChanges();
      }
    });
  }



  async loadUserForums(uid: string) {
    const q = query(
      collection(this.firestore, 'forums'),
      where('author_id', '==', uid)
    );
    const snap = await getDocs(q);
    this.sharedForums = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    this.cdr.detectChanges();
  }

  async loadUserTests(uid: string) {
    const q = query(
      collection(this.firestore, 'tests'),
      where('author_id', '==', uid)
    );
    const snap = await getDocs(q);
    this.sharedTests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
