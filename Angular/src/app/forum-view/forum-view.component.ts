import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';
import { HeaderComponent } from '../components/header/header';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, orderBy, where, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent, AsideComponent, HeaderComponent],
  templateUrl: './forum-view.component.html',
  styleUrl: './forum-view.component.css'
})
export class ForumViewComponent implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private authSub?: Subscription;
  private unsubPosts?: () => void;

  currentUserId: string = '';
  currentUserName: string = '';
  currentUserPicture: string = '';
  forumId: string = '';
  currentForum: any = null;
  forumPosts: any[] = [];

  menuVisible: boolean = false;
  showCommentModal: boolean = false;
  newPostInForumContent: string = '';
  replyInputs: Record<string, string> = {};
  expandedReplies: Record<string, boolean> = {};
  attachedFile: File | null = null;
  attachedImageData: string | null = null;
  attachedPdfName: string | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.forumId = params.get('id') || '';
      this.loadForum();
    });

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

        // Cargar posts AQUÍ, cuando ya tenemos el userId
        if (this.forumId) {
          this.unsubPosts?.(); // cancelar suscripción anterior si existe
          this.loadForumPosts();
        }
      }
    });
  }

  goBack() { this.location.back(); }

  goToProfile(userId: string) {
    if (userId === this.currentUserId) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/user-profile', userId]);
    }
  }

  async loadForum() {
    const forumRef = doc(this.firestore, `forums/${this.forumId}`);
    const snap = await getDoc(forumRef);
    if (snap.exists()) {
      this.currentForum = { id: snap.id, ...snap.data() };
      this.cdr.detectChanges();
    }
  }

  loadForumPosts() {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('forum_id', '==', this.forumId), orderBy('created_at', 'desc'));

    this.unsubPosts = onSnapshot(q, snapshot => {
      this.forumPosts = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          likedByMe: (data['likedBy'] || []).includes(this.currentUserId)
        };
      });
      this.cdr.detectChanges();
    });
  }

  async publishForumPost() {
    if (!this.newPostInForumContent.trim() && !this.attachedFile) return;
    if (!this.currentUserId) return;

    const newPost: any = {
      author_id: this.currentUserId,
      author_name: this.currentUserName,
      forum_id: this.forumId,
      forum_name: this.currentForum?.forum_title || this.forumId,
      Description: this.newPostInForumContent,
      Likes: 0,
      likedBy: [],
      replies: [],
      created_at: new Date().toISOString()
    };

    if (this.attachedImageData) newPost.imageData = this.attachedImageData;
    if (this.attachedPdfName) newPost.pdfName = this.attachedPdfName;

    await addDoc(collection(this.firestore, 'posts'), newPost);

    this.newPostInForumContent = '';
    this.removeAttachment();
    this.menuVisible = false;
    this.showCommentModal = false;
    this.cdr.detectChanges();
  }

  async deletePost(postId: string) {
    if (!confirm('¿Borrar esta publicación?')) return;
    await deleteDoc(doc(this.firestore, 'posts', postId));
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

  toggleReplies(postId: string) {
    this.expandedReplies[postId] = !this.expandedReplies[postId];
  }

  async submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const post = this.forumPosts.find(p => p.id === postId);
    if (!post) return;
    const replies = [...(post.replies || [])];
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

  toggleAddMenu(target: any, event: MouseEvent) {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.attachedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.attachedImageData = e.target?.result as string; };
    reader.readAsDataURL(file);
    this.menuVisible = false;
  }

  onPdfSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.attachedFile = file;
    this.attachedPdfName = file.name;
    this.menuVisible = false;
  }

  removeAttachment() {
    this.attachedFile = null;
    this.attachedImageData = null;
    this.attachedPdfName = null;
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.unsubPosts?.();
  }
}
