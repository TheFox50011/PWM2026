import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, AsideComponent, CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubPosts?: () => void;

  currentUserId: string = '';
  favoritePosts: any[] = [];

  ngOnInit() {
    this.authSub = authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadFavorites();
      }
    });
  }

  loadFavorites() {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('created_at', 'desc'));
    this.unsubPosts = onSnapshot(q, async snapshot => {
      const posts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((p: any) => (p.favoritedBy || []).includes(this.currentUserId));

      for (const post of posts as any[]) {
        post.author_name = await this.resolveAuthorName(post.author_id);
      }

      this.favoritePosts = posts;
      this.cdr.detectChanges();
    });
  }

  async removeFavorite(post: any) {
    const favoritedBy = (post.favoritedBy || []).filter((id: string) => id !== this.currentUserId);
    await updateDoc(doc(this.firestore, 'posts', post.id), { favoritedBy });
  }

  private async resolveAuthorName(authorId: string): Promise<string> {
    try {
      const userSnap = await getDoc(doc(this.firestore, `users/${authorId}`));
      return userSnap.exists() ? (userSnap.data()['username'] || 'Usuario') : 'Usuario no encontrado';
    } catch {
      return 'Usuario no encontrado';
    }
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubPosts?.();
  }
}
