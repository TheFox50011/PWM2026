import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy, where, getDoc, limit } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-view',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, FooterComponent, HeaderComponent, AsideComponent, IonButton],
  templateUrl: './forum-view.component.html',
  styleUrl: './forum-view.component.css',
})
export class ForumViewComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authSub?: Subscription;
  private unsubPosts?: () => void;
  private unsubForum?: () => void;
  private unsubUsers?: () => void;
  private unsubForums?: () => void;
  private unsubUser?: () => void;

  // Cache de nombres de autor para no repetir getDoc
  private authorNameCache: Record<string, string> = {};

  @ViewChild('forumPostText') forumPostText!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('pdfInput') pdfInput!: ElementRef;

  currentUserId: string = '';
  currentUserName: string = '';
  currentUserPicture: string = '';
  forum: any = null;
  forumPosts: any[] = [];
  replyInputs: Record<string, string> = {};
  expandedReplies: Record<string, boolean> = {};
  attachedFile: File | null = null;
  attachedImageData: string | null = null;
  attachedPdfName: string | null = null;
  attachedPdfData: string | null = null;
  showUserModal: boolean = false;
  selectedUser: any = null;
  suggestedUsers: any[] = [];
  customForums: any[] = [];

  constructor() {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const forumId = params.get('id');
      if (!forumId) { this.router.navigate(['/mainpage']); return; }
      this.forumPosts = [];
      this.expandedReplies = {};
      this.replyInputs = {};
      this.authorNameCache = {};
      if (this.unsubPosts) this.unsubPosts();
      if (this.unsubForum) this.unsubForum();
      this.loadForum(forumId);
      this.loadForumPosts(forumId);
    });

    this.authSub = authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        // FIX: guardar la unsub del listener del usuario actual
        this.unsubUser = onSnapshot(userRef, snap => {
          const data = snap.data();
          this.currentUserName = data?.['username'] || user.displayName || 'Usuario';
          this.currentUserPicture = data?.['profilePicture'] || '';
          this.cdr.detectChanges();
        });
      }
    });

    this.loadUsers();
    this.loadCustomForums();
  }

  loadForum(forumId: string) {
    const forumRef = doc(this.firestore, `forums/${forumId}`);
    this.unsubForum = onSnapshot(forumRef, snap => {
      if (snap.exists()) {
        this.forum = { id: snap.id, ...snap.data() };
        this.cdr.detectChanges();
      } else {
        this.router.navigate(['/mainpage']);
      }
    });
  }

  loadForumPosts(forumId: string) {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('forum_id', '==', forumId), orderBy('created_at', 'desc'));

    this.unsubPosts = onSnapshot(q, async snapshot => {
      const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

      // FIX: recolectar todos los author_id únicos y resolver en paralelo
      const allAuthorIds = new Set<string>();
      for (const post of posts) {
        if (post.author_id) allAuthorIds.add(post.author_id);
        if (post.replies) {
          for (const reply of post.replies) {
            if (reply.author_id) allAuthorIds.add(reply.author_id);
          }
        }
      }

      // Solo buscar los que no están en caché
      const idsToFetch = [...allAuthorIds].filter(id => !this.authorNameCache[id]);
      if (idsToFetch.length > 0) {
        await Promise.all(
          idsToFetch.map(async id => {
            this.authorNameCache[id] = await this.resolveAuthorName(id);
          })
        );
      }

      // Asignar nombres desde caché (sin más async)
      for (const post of posts) {
        // FIX: usar author_name guardado en el post si existe, si no usar caché
        post.author_name = post.author_name || this.authorNameCache[post.author_id] || 'Usuario';
        post.likedByMe = (post.likedBy || []).includes(this.currentUserId);
        if (post.replies) {
          for (const reply of post.replies) {
            reply.author_name = reply.author_name || this.authorNameCache[reply.author_id] || 'Usuario';
          }
        }
      }

      this.forumPosts = posts;
      this.cdr.detectChanges();
    });
  }

  async publishPost() {
    const text = this.forumPostText?.nativeElement.value.trim();
    if (!text && !this.attachedFile) return;
    if (!this.currentUserId || !this.forum) return;

    const newPost: any = {
      author_id: this.currentUserId,
      author_name: this.currentUserName, // guardado directamente, no hace falta resolveAuthorName
      forum_id: this.forum.id,
      forum_name: this.forum.forum_title,
      Description: text || '',
      Likes: 0,
      likedBy: [],
      replies: [],
      created_at: new Date().toISOString()
    };

    if (this.attachedImageData) newPost.imageData = this.attachedImageData;
    if (this.attachedPdfName) newPost.pdfName = this.attachedPdfName;
    if (this.attachedPdfData) newPost.pdfData = this.attachedPdfData;

    await addDoc(collection(this.firestore, 'posts'), newPost);
    this.forumPostText.nativeElement.value = '';
    this.removeAttachment();
  }

  async deletePost(id: string) {
    if (!confirm('¿Borrar esta publicación?')) return;
    await deleteDoc(doc(this.firestore, 'posts', id));
  }

  async toggleLike(postId: string) {
    const post = this.forumPosts.find(p => p.id === postId);
    if (!post || post.author_id === this.currentUserId) return;
    const likedBy: string[] = post.likedBy || [];
    const alreadyLiked = likedBy.includes(this.currentUserId);
    const newLikedBy = alreadyLiked
      ? likedBy.filter((id: string) => id !== this.currentUserId)
      : [...likedBy, this.currentUserId];
    await updateDoc(doc(this.firestore, 'posts', postId), {
      Likes: newLikedBy.length,
      likedBy: newLikedBy
    });
    if (!alreadyLiked) {
      await addDoc(collection(this.firestore, 'notifications'), {
        to_uid: post.author_id,
        from_uid: this.currentUserId,
        from_name: this.currentUserName,
        message: `${this.currentUserName} le ha dado like a tu publicación.`,
        type: 'like',
        read: false,
        created_at: new Date().toISOString()
      });
    }
  }

  async toggleFavorite(post: any) {
    if (!this.currentUserId) return;
    const favoritedBy: string[] = post.favoritedBy || [];
    const alreadyFav = favoritedBy.includes(this.currentUserId);
    const newFavoritedBy = alreadyFav
      ? favoritedBy.filter((id: string) => id !== this.currentUserId)
      : [...favoritedBy, this.currentUserId];
    await updateDoc(doc(this.firestore, 'posts', post.id), { favoritedBy: newFavoritedBy });
  }

  toggleReplies(postId: string) {
    this.expandedReplies[postId] = !this.expandedReplies[postId];
    this.cdr.detectChanges();
  }

  async submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const post = this.forumPosts.find(p => p.id === postId);
    if (!post) return;
    const replies = post.replies || [];
    replies.push({
      author_id: this.currentUserId,
      author_name: this.currentUserName, // guardado directamente
      content,
      created_at: new Date().toISOString()
    });
    await updateDoc(doc(this.firestore, 'posts', postId), { replies });
    this.replyInputs[postId] = '';
    this.expandedReplies[postId] = true;
  }

  async deleteReply(postId: string, replyIndex: number) {
    if (!confirm('¿Borrar este comentario?')) return;
    const post = this.forumPosts.find(p => p.id === postId);
    if (!post) return;
    const replies = [...(post.replies || [])];
    replies.splice(replyIndex, 1);
    await updateDoc(doc(this.firestore, 'posts', postId), { replies });
  }

  loadUsers() {
    const usersRef = collection(this.firestore, 'users');
    // FIX: limitar a 20 usuarios, no cargar toda la colección
    const q = query(usersRef, limit(20));
    this.unsubUsers = onSnapshot(q, snapshot => {
      this.suggestedUsers = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((u: any) => u.id !== this.currentUserId);
      this.cdr.detectChanges();
    });
  }

  loadCustomForums() {
    const forumsRef = collection(this.firestore, 'forums');
    const q = query(forumsRef, orderBy('created_at', 'desc'));
    this.unsubForums = onSnapshot(q, snapshot => {
      this.customForums = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      this.cdr.detectChanges();
    });
  }

  enterForum(forum: any) {
    this.router.navigate(['/forum', forum.id || forum.forum_id]);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.attachedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.attachedImageData = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  onPdfSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.attachedFile = file;
    this.attachedPdfName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => { this.attachedPdfData = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeAttachment() {
    this.attachedFile = null;
    this.attachedImageData = null;
    this.attachedPdfName = null;
    this.attachedPdfData = null;
    if (this.imageInput) this.imageInput.nativeElement.value = '';
    if (this.pdfInput) this.pdfInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  goBack() { this.router.navigate(['/mainpage']); }

  openUserProfile(user: any) { this.selectedUser = user; this.showUserModal = true; this.cdr.detectChanges(); }
  closeUserModal() { this.showUserModal = false; this.selectedUser = null; this.cdr.detectChanges(); }

  toggleAddMenu(btn: HTMLElement, event: MouseEvent) {
    event.stopPropagation();
    const menu = btn.closest('.add-btn-container')?.querySelector('.add-popup-menu') as HTMLElement;
    if (!menu) return;
    const isOpen = menu.style.display === 'flex';
    document.querySelectorAll('.add-popup-menu').forEach((m: any) => m.style.display = 'none');
    menu.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
      const close = () => { menu.style.display = 'none'; document.removeEventListener('click', close); };
      document.addEventListener('click', close);
    }
  }

  async toggleFollow(user: any) {
    if (!this.currentUserId || user.id === this.currentUserId) return;
    const userRef = doc(this.firestore, `users/${user.id}`);
    const myRef = doc(this.firestore, `users/${this.currentUserId}`);
    const followers: string[] = user.followers_list || [];
    const alreadyFollowing = followers.includes(this.currentUserId);
    const newFollowers = alreadyFollowing
      ? followers.filter((id: string) => id !== this.currentUserId)
      : [...followers, this.currentUserId];
    await updateDoc(userRef, { followers: newFollowers.length, followers_list: newFollowers });
    const myData = this.suggestedUsers.find(u => u.id === this.currentUserId);
    const myFollowing: string[] = myData?.following_list || [];
    const newFollowing = alreadyFollowing
      ? myFollowing.filter((id: string) => id !== this.currentUserId)
      : [...myFollowing, user.id];
    await updateDoc(myRef, { following: newFollowing.length, following_list: newFollowing });
    this.selectedUser = { ...this.selectedUser, followers: newFollowers.length, followers_list: newFollowers };
    if (!alreadyFollowing) {
      await addDoc(collection(this.firestore, 'notifications'), {
        to_uid: user.id,
        from_uid: this.currentUserId,
        from_name: this.currentUserName,
        message: `${this.currentUserName} ha comenzado a seguirte.`,
        type: 'follow',
        created_at: new Date().toISOString()
      });
    }
    this.cdr.detectChanges();
  }

  isFollowing(user: any): boolean {
    return (user?.followers_list || []).includes(this.currentUserId);
  }

  private async resolveAuthorName(authorId: string): Promise<string> {
    if (this.authorNameCache[authorId]) return this.authorNameCache[authorId];
    try {
      const userSnap = await getDoc(doc(this.firestore, `users/${authorId}`));
      return userSnap.exists() ? (userSnap.data()['username'] || 'Usuario') : 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubPosts?.();
    this.unsubForum?.();
    this.unsubUsers?.();
    this.unsubForums?.();
    this.unsubUser?.();
  }
}
