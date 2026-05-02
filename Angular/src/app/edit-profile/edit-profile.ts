import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubSnapshot?: () => void;

  profilePicture: string = '';
  name: string = '';
  biography: string = '';
  location: string = '';
  email: string = '';
  link1: string = '';
  uid: string = '';
  saving: boolean = false;
  successMessage: string = '';

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe(user => {
      this.unsubSnapshot?.();
      if (user) {
        this.uid = user.uid;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        this.unsubSnapshot = onSnapshot(userRef, snapshot => {
          const data = snapshot.data();
          if (data) {
            this.name = data['username'] || '';
            this.biography = data['biography'] || '';
            this.location = data['location'] || '';
            this.email = data['email'] || user.email || '';
            this.link1 = data['link1'] || '';
            this.profilePicture = data['profilePicture'] || '';
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  async saveChanges() {
    if (!this.uid) return;
    this.saving = true;
    try {
      const userRef = doc(this.firestore, `users/${this.uid}`);
      await updateDoc(userRef, {
        username: this.name,
        biography: this.biography,
        location: this.location,
        email: this.email,
        link1: this.link1,
        profilePicture: this.profilePicture,
      });
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/profile']);
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profilePicture = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.unsubSnapshot?.();
  }
}
