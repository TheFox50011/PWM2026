import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy, getDocs, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, AsideComponent, RouterLink],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css'
})
export class Mainpage implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubPosts?: () => void;
  private unsubForums?: () => void;

  @ViewChild('newPostText') newPostText!: ElementRef;

  currentUserId: string = '';
  currentUserName: string = '';
  currentUserPicture: string = '';
  generalPosts: any[] = [];
  customForums: any[] = [];
  activeTab: string = 'general';
  replyInputs: Record<string, string> = {};
  expandedReplies: Record<string, boolean> = {};
  attachedFile: File | null = null;
  attachedImageData: string | null = null;
  attachedPdfName: string | null = null;
  showUserModal: boolean = false;
  selectedUser: any = null;
  availableTests: any[] = [];

  suggestedUsers: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.authSub = authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        // Obtener username de Firestore
        const userRef = doc(this.firestore, `users/${user.uid}`);
        onSnapshot(userRef, snap => {
          const data = snap.data();
          this.currentUserName = data?.['username'] || user.displayName || 'Usuario';
          this.currentUserPicture = data?.['profilePicture'] || '';
          this.cdr.detectChanges();
        });
      }
    });

    this.loadGeneralPosts();
    this.loadCustomForums();
    this.loadUsers();
    this.loadTests();
    this.cdr.detectChanges();
  }

  setTab(tab: string) { this.activeTab = tab; }

  // ─── POSTS ───────────────────────────────────────────────
  loadGeneralPosts() {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('created_at', 'desc'));
    this.unsubPosts = onSnapshot(q, snapshot => {
      this.generalPosts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((p: any) => p.forum_name === 'General');
      this.cdr.detectChanges();
    });
  }

  async publishPost() {
    const text = this.newPostText?.nativeElement.value.trim();
    if (!text && !this.attachedFile) return;
    if (!this.currentUserId) return;

    const newPost: any = {
      author_id: this.currentUserId,
      author_name: this.currentUserName,
      forum_name: 'General',
      Description: text || '',
      Likes: 0,
      likedBy: [],
      replies: [],
      created_at: new Date().toISOString()
    };

    if (this.attachedImageData) newPost.imageData = this.attachedImageData;
    if (this.attachedPdfName) newPost.pdfName = this.attachedPdfName;

    await addDoc(collection(this.firestore, 'posts'), newPost);
    this.newPostText.nativeElement.value = '';
    this.removeAttachment();
  }

  async deletePost(id: string) {
    if (!confirm('¿Borrar esta publicación?')) return;
    await deleteDoc(doc(this.firestore, 'posts', id));
  }

  // ─── LIKES ───────────────────────────────────────────────
  async toggleLike(postId: string) {
    const post = this.generalPosts.find(p => p.id === postId);
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

  // ─── REPLIES ─────────────────────────────────────────────
  toggleReplies(postId: string) {
    this.expandedReplies[postId] = !this.expandedReplies[postId];
    this.cdr.detectChanges();
  }

  async submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const post = this.generalPosts.find(p => p.id === postId);
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

    if (post.author_id !== this.currentUserId) {
      await addDoc(collection(this.firestore, 'notifications'), {
        to_uid: post.author_id,
        from_uid: this.currentUserId,
        from_name: this.currentUserName,
        message: `${this.currentUserName} ha comentado en tu publicación: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
        type: 'comment',
        post_id: postId,
        read: false,
        created_at: new Date().toISOString()
      });
    }
  }

  async deleteReply(postId: string, replyIndex: number) {
    if (!confirm('¿Borrar este comentario?')) return;
    const post = this.generalPosts.find(p => p.id === postId);
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
        .filter((u: any) => u.id !== this.currentUserId); // excluye al usuario actual
      this.cdr.detectChanges();
    });
  }

  // ─── FOROS ───────────────────────────────────────────────
  loadCustomForums() {
    const forumsRef = collection(this.firestore, 'forums');
    const q = query(forumsRef, orderBy('created_at', 'desc'));
    this.unsubForums = onSnapshot(q, snapshot => {
      this.customForums = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      this.cdr.detectChanges();
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.customForums = this.customForums.filter(f =>
      f.forum_title?.toLowerCase().includes(term)
    );
    if (!term) this.loadCustomForums();
  }

  enterForum(forum: any) {
    this.router.navigate(['/forum', forum.id || forum.forum_id]);
  }

  // ─── TESTS ───────────────────────────────────────────────
  loadTests() {
    const testsRef = collection(this.firestore, 'tests');
    const q = query(testsRef, orderBy('created_at', 'desc'));
    onSnapshot(q, snapshot => {
      this.availableTests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      this.cdr.detectChanges();
    });
  }

  startTest(test: any) {
    const id = test.id || test.test_id;
    if (id) this.router.navigate(['/do-test', id]);
  }

  async deleteTest(test: any) {
    if (!confirm('¿Eliminar este test?')) return;
    const id = test.id || test.test_id;
    if (id) await deleteDoc(doc(this.firestore, 'tests', id));
  }

  goToCreateTest() { this.router.navigate(['/create-test']); }

  // ─── ADJUNTOS ────────────────────────────────────────────
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

    // Actualiza también el "following" del usuario actual
    const myData = this.suggestedUsers.find(u => u.id === this.currentUserId);
    const myFollowing: string[] = myData?.following_list || [];
    const newFollowing = alreadyFollowing
      ? myFollowing.filter((id: string) => id !== this.currentUserId)
      : [...myFollowing, user.id];

    await updateDoc(myRef, {
      following: newFollowing.length,
      following_list: newFollowing
    });

    // Actualiza local para que el botón cambie sin recargar
    this.selectedUser = {
      ...this.selectedUser,
      followers: newFollowers.length,
      followers_list: newFollowers
    };

    // Crear notificación si está siguiendo (no si deja de seguir)
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

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubPosts?.();
    this.unsubForums?.();
  }
}
