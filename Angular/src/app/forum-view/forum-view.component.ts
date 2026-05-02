import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, AsideComponent],
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

  @ViewChild('forumPostText') forumPostText!: ElementRef;

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
  showUserModal: boolean = false;
  selectedUser: any = null;
  suggestedUsers: any[] = [];
  customForums: any[] = [];

  constructor() {}

  ngOnInit() {
    this.authSub = authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        onSnapshot(userRef, snap => {
          const data = snap.data();
          this.currentUserName = data?.['username'] || user.displayName || 'Usuario';
          this.currentUserPicture = data?.['profilePicture'] || '';
          this.cdr.detectChanges();
        });
      }
    });

    this.loadForum();
    this.loadForumPosts();
    this.loadUsers();
    this.loadCustomForums();
  }

  loadForum() {
    const forumId = this.route.snapshot.paramMap.get('id');
    if (!forumId) {
      this.router.navigate(['/mainpage']);
      return;
    }
    const forumRef = doc(this.firestore, `forums/${forumId}`);
    onSnapshot(forumRef, snap => {
      if (snap.exists()) {
        this.forum = { id: snap.id, ...snap.data() };
      } else {
        this.router.navigate(['/mainpage']);
      }
    });
  }

  loadForumPosts() {
    const forumId = this.route.snapshot.paramMap.get('id');
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('forum_id', '==', forumId), orderBy('created_at', 'desc'));
    this.unsubPosts = onSnapshot(q, snapshot => {
      this.forumPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      this.cdr.detectChanges();
    });
  }

  async publishPost() {
    const text = this.forumPostText?.nativeElement.value.trim();
    if (!text && !this.attachedFile) return;
    if (!this.currentUserId || !this.forum) return;

    const newPost: any = {
      author_id: this.currentUserId,
      author_name: this.currentUserName,
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
  }

  async submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const post = this.forumPosts.find(p => p.id === postId);
    if (!post) return;
    const replies = post.replies || [];
    replies.push({
      author_id: this.currentUserId,
      author_name: this.currentUserName,
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
    onSnapshot(usersRef, snapshot => {
      this.suggestedUsers = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((u: any) => u.id !== this.currentUserId);
      this.cdr.detectChanges();
    });
  }

  loadCustomForums() {
    const forumsRef = collection(this.firestore, 'forums');
    const q = query(forumsRef, orderBy('created_at', 'desc'));
    onSnapshot(q, snapshot => {
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
  }

  removeAttachment() {
    this.attachedFile = null;
    this.attachedImageData = null;
    this.attachedPdfName = null;
  }

  goBack() {
    this.router.navigate(['/mainpage']);
  }

  openUserProfile(user: any) { this.selectedUser = user; this.showUserModal = true; this.cdr.detectChanges();}
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
    await updateDoc(userRef, {
      followers: newFollowers.length,
      followers_list: newFollowers
    });
    const myData = this.suggestedUsers.find(u => u.id === this.currentUserId);
    const myFollowing: string[] = myData?.following_list || [];
    const newFollowing = alreadyFollowing
      ? myFollowing.filter((id: string) => id !== this.currentUserId)
      : [...myFollowing, user.id];
    await updateDoc(myRef, {
      following: newFollowing.length,
      following_list: newFollowing
    });
    this.selectedUser = {
      ...this.selectedUser,
      followers: newFollowers.length,
      followers_list: newFollowers
    };
    this.cdr.detectChanges();
  }

  isFollowing(user: any): boolean {
    return (user?.followers_list || []).includes(this.currentUserId);
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubPosts?.();
  }
}
