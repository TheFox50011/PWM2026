// mainpage.ts - Componente Angular actualizado
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, AsideComponent, RouterLink],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css'
})
export class Mainpage implements OnInit {
  @ViewChild('newPostText') newPostText!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('pdfInput') pdfInput!: ElementRef;

  currentUserId: string = '1';
  allPosts: any[] = [];
  customForums: any[] = [];
  selectedForum: any = null;
  forumFilter: string = '';

  // Tabs: 'all' | 'posts' | 'forums' | 'tests'
  activeTab: string = 'all';

  // Modal publicar en foro
  showCommentModal: boolean = false;
  newPostInForumContent: string = '';

  // Modal perfil de usuario
  showUserModal: boolean = false;
  selectedUser: any = null;

  // Respuestas y expansión
  replyInputs: Record<string, string> = {};
  expandedReplies: Record<string, boolean> = {};

  // Archivo adjunto actual
  attachedFile: File | null = null;
  attachedImageData: string | null = null;
  attachedPdfName: string | null = null;

  // Tests de ejemplo
  availableTests: any[] = [
    { id: 'test_1', title: 'Test de Angular Básico', description: 'Evalúa tus conocimientos de Angular', questions: 10 },
    { id: 'test_2', title: 'Test de TypeScript', description: 'Repaso de tipos y funciones', questions: 15 },
    { id: 'test_3', title: 'Test de CSS Avanzado', description: 'Flexbox, Grid y animaciones', questions: 12 },
  ];

  // Usuarios sugeridos para el sidebar derecho
  suggestedUsers: any[] = [
    { id: 2, name: 'User1', role: 'Estudiante', posts: 12, likes: 34, forums: 3, bio: 'Apasionado por el desarrollo web y Angular.' },
    { id: 3, name: 'User2', role: 'Profesor', posts: 45, likes: 120, forums: 8, bio: 'Docente de programación con 10 años de experiencia.' },
    { id: 4, name: 'User3', role: 'Estudiante', posts: 7, likes: 18, forums: 2, bio: 'Aprendiendo cada día algo nuevo.' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('loggedUserId') || '1';
    this.loadCustomForums();
    this.loadPosts();
  }

  // ─── TABS ───────────────────────────────────────────────────
  setTab(tab: string) {
    this.activeTab = tab;
  }

  get filteredPosts(): any[] {
    return this.allPosts;
  }

  // ─── FOROS ──────────────────────────────────────────────────
  selectForum(forum: any) {
    this.selectedForum = forum;
    this.forumFilter = forum.forum_title;
    this.showCommentModal = true;
    this.loadPosts();
  }

  closeCommentModal() {
    this.showCommentModal = false;
    this.newPostInForumContent = '';
  }

  clearForumFilter() {
    this.selectedForum = null;
    this.forumFilter = '';
    this.loadPosts();
  }

  loadCustomForums() {
    const savedForums = localStorage.getItem('myCustomForums');
    this.customForums = savedForums ? JSON.parse(savedForums) : [];
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();
    this.loadCustomForums();
    this.customForums = this.customForums.filter(f =>
      f.forum_title.toLowerCase().includes(term)
    );
  }

  // ─── PUBLICAR ───────────────────────────────────────────────
  publishPostInForum() {
    if (!this.newPostInForumContent.trim()) return;
    this.savePost(this.newPostInForumContent);
    this.closeCommentModal();
  }

  publishPost() {
    if (!this.newPostText) return;
    const text = this.newPostText.nativeElement.value.trim();
    if (!text && !this.attachedFile) return;
    this.savePost(text || '');
    this.newPostText.nativeElement.value = '';
    this.attachedFile = null;
    this.attachedImageData = null;
    this.attachedPdfName = null;
  }

  private savePost(text: string) {
    const posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const newPost: any = {
      post_id: 'post_' + Date.now(),
      author_id: parseInt(this.currentUserId),
      author_name: 'Yo',
      forum_name: this.forumFilter || 'General',
      Description: text,
      Likes: 0,
      likedByMe: false,
      replies: [],
      created_at: new Date().toISOString()
    };

    // Adjuntar imagen si existe
    if (this.attachedImageData) {
      newPost.imageData = this.attachedImageData;
    }

    // Adjuntar nombre del PDF si existe
    if (this.attachedPdfName) {
      newPost.pdfName = this.attachedPdfName;
    }

    posts.push(newPost);
    localStorage.setItem('myCustomPosts', JSON.stringify(posts));
    this.loadPosts();
  }

  loadPosts() {
    let posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    if (this.forumFilter) {
      posts = posts.filter((p: any) => p.forum_name === this.forumFilter);
    }
    this.allPosts = posts.reverse();
  }

  // ─── ADJUNTOS ────────────────────────────────────────────────
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  triggerImageInput() {
    this.imageInput.nativeElement.click();
  }

  triggerPdfInput() {
    this.pdfInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.attachedFile = input.files[0];
    if (this.attachedFile.type.startsWith('image/')) {
      this.readAsImage(this.attachedFile);
    } else if (this.attachedFile.type === 'application/pdf') {
      this.attachedPdfName = this.attachedFile.name;
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.attachedFile = input.files[0];
    this.readAsImage(this.attachedFile);
  }

  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.attachedFile = input.files[0];
    this.attachedPdfName = this.attachedFile.name;
  }

  private readAsImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.attachedImageData = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeAttachment() {
    this.attachedFile = null;
    this.attachedImageData = null;
    this.attachedPdfName = null;
  }

  // ─── INTERACCIONES ──────────────────────────────────────────
  toggleLike(postId: string) {
    const posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const idx = posts.findIndex((p: any) => p.post_id === postId);
    if (idx !== -1 && posts[idx].author_id !== +this.currentUserId) {
      if (posts[idx].likedByMe) {
        posts[idx].Likes = Math.max(0, posts[idx].Likes - 1);
        posts[idx].likedByMe = false;
      } else {
        posts[idx].Likes++;
        posts[idx].likedByMe = true;
      }
      localStorage.setItem('myCustomPosts', JSON.stringify(posts));
      this.loadPosts();
    }
  }

  toggleReplies(postId: string) {
    this.expandedReplies[postId] = !this.expandedReplies[postId];
  }

  deletePost(id: string) {
    if (!confirm('¿Borrar esta publicación?')) return;
    let posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    posts = posts.filter((p: any) => p.post_id !== id);
    localStorage.setItem('myCustomPosts', JSON.stringify(posts));
    this.loadPosts();
  }

  deleteReply(postId: string, replyIndex: number) {
    if (!confirm('¿Estás seguro de que quieres borrar tu comentario?')) return;
    const posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const postIdx = posts.findIndex((p: any) => p.post_id === postId);
    if (postIdx !== -1) {
      posts[postIdx].replies.splice(replyIndex, 1);
      localStorage.setItem('myCustomPosts', JSON.stringify(posts));
      this.loadPosts();
    }
  }

  submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const posts = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const idx = posts.findIndex((p: any) => p.post_id === postId);
    if (idx !== -1) {
      posts[idx].replies.push({
        author_id: +this.currentUserId,
        author_name: 'Yo',
        content: content,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('myCustomPosts', JSON.stringify(posts));
      this.replyInputs[postId] = '';
      this.expandedReplies[postId] = true; // Abrir respuestas al enviar
      this.loadPosts();
    }
  }

  // ─── TESTS ──────────────────────────────────────────────────
  startTest(test: any) {
    // Aquí puedes navegar a la página del test
    this.router.navigate(['/test', test.id]);
  }

  // ─── PERFIL DE USUARIO ──────────────────────────────────────
  openUserProfile(user: any) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  // ─── POPUP MENÚ + ──────────────────────────────────────────
  toggleAddMenu(btn: HTMLElement, event: MouseEvent) {
    event.stopPropagation();
    const container = btn.closest('.add-btn-container');
    const menu = container?.querySelector('.add-popup-menu') as HTMLElement;
    if (!menu) return;
    const isOpen = menu.style.display === 'flex';
    // Cierra todos los menús abiertos
    document.querySelectorAll('.add-popup-menu').forEach((m: any) => m.style.display = 'none');
    menu.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
      const close = () => {
        menu.style.display = 'none';
        document.removeEventListener('click', close);
      };
      document.addEventListener('click', close);
    }
  }
}
