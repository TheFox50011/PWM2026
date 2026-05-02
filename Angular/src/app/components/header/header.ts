import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink, CommonModule],
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

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        this.unsubSnapshot = onSnapshot(userRef, snapshot => {
          const data = snapshot.data();
          if (data) {
            this.userName = data['username'] || user.displayName || 'Usuario';
            this.profilePicture = data['profilePicture'] || '/dummy_picture.jpeg';
          }
          this.cdr.detectChanges(); // ← fuerza el re-render
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
