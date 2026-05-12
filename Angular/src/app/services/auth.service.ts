import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth);

  async register(email: string, password: string, userData: any): Promise<any> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(this.firestore, 'users', user.uid), {
      uid: user.uid,
      email: userData.email,
      name: userData.name,
      surname: userData.surname,
      username: userData.username,
      profilePicture: userData.profilePicture || '',
      createdAt: new Date().toISOString()
    });

    return userCredential;
  }

  async login(emailOrUsername: string, password: string): Promise<any> {
    let email = emailOrUsername;

    if (!emailOrUsername.includes('@')) {
      const userDoc = await getDoc(doc(this.firestore, 'usernames', emailOrUsername));
      if (userDoc.exists()) {
        email = userDoc.data()['email'];
      } else {
        throw new Error('Usuario no encontrado');
      }
    }

    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
