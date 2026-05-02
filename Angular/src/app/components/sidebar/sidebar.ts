import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot, collection, query, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  imports: [RouterLink, CommonModule], // ← añade CommonModule
})
export class AsideComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;
  private unsubNotifs?: () => void;

  profilePicture: string = 'dummy_picture.jpeg';
  userName: string = 'Invitado';
  unreadCount: number = 0; // ← AÑADE

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      this.unsubNotifs?.(); // ← AÑADE
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

        // ← AÑADE ESTO: escucha notificaciones no leídas
        const notifQ = query(
          collection(this.firestore, 'notifications'),
          where('to_uid', '==', user.uid)
        );
        this.unsubNotifs = onSnapshot(notifQ, snap => {
          // Cuenta solo las que tienen read: false o no tienen el campo read
          this.unreadCount = snap.docs.filter(d => !d.data()['read']).length;
          this.cdr.detectChanges();
        });

      } else {
        this.userName = 'Invitado';
        this.profilePicture = 'dummy_picture.jpeg';
        this.unreadCount = 0;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
    this.unsubNotifs?.();
  }
}
