import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  imports: [RouterLink],
})
export class AsideComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  profilePicture: string = 'dummy_picture.jpeg';
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
            this.profilePicture = data['profilePicture'] || 'dummy_picture.jpeg';
          }
          this.cdr.detectChanges();
        });
      } else {
        this.userName = 'Invitado';
        this.profilePicture = 'dummy_picture.jpeg';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
