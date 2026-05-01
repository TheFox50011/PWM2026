// mainpage.ts
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

  currentUserId: string = '1';

  // Solo los posts de General
  generalPosts: any[] = [];

  // Foros (solo para navegar, no mezclan posts con General)
  customForums: any[] = [];
  // Tab activo: 'general' | 'forums' | 'tests'
  activeTab: string = 'general';

  // Replies y expansión
  replyInputs: Record<string, string> = {};
  expandedReplies: Record<string, boolean> = {};

  // Adjuntos
  attachedFile: File | null = null;
  attachedImageData: string | null = null;
  attachedPdfName: string | null = null;

  // Modal usuario
  showUserModal: boolean = false;
  selectedUser: any = null;

  // Tests de ejemplo
  availableTests: any[] = [
    { id: 'test_1', title: 'Test de Angular Básico', description: 'Evalúa tus conocimientos de Angular', questions: 10 },
    { id: 'test_2', title: 'Test de TypeScript', description: 'Repaso de tipos y funciones', questions: 15 },
    { id: 'test_3', title: 'Test de CSS Avanzado', description: 'Flexbox, Grid y animaciones', questions: 12 },
  ];

  // Usuarios sugeridos sidebar
  suggestedUsers: any[] = [
    { id: 2, name: 'User1', role: 'Estudiante', posts: 12, likes: 34, forums: 3, bio: 'Apasionado por el desarrollo web y Angular.' },
    { id: 3, name: 'User2', role: 'Profesor', posts: 45, likes: 120, forums: 8, bio: 'Docente de programación con 10 años de experiencia.' },
    { id: 4, name: 'User3', role: 'Estudiante', posts: 7, likes: 18, forums: 2, bio: 'Aprendiendo cada día algo nuevo.' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('loggedUserId') || '1';
    this.loadCustomForums();
    this.loadGeneralPosts();
    this.loadTests();
  }

  // ─── TABS ────────────────────────────────────────────────
  setTab(tab: string) {
    this.activeTab = tab;
  }

  // ─── FOROS: navega a la página del foro (sin popup) ─────
  enterForum(forum: any) {
    // Guarda el foro seleccionado y navega a la ruta del foro
    // Ajusta la ruta según tu routing: '/forum/:id', '/forums/view', etc.
    this.router.navigate(['/forum', forum.forum_id || forum.forum_title]);
  }

  loadCustomForums() {
    const saved = localStorage.getItem('myCustomForums');
    this.customForums = saved ? JSON.parse(saved) : [];
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.loadCustomForums();
    this.customForums = this.customForums.filter(f =>
      f.forum_title.toLowerCase().includes(term)
    );
  }

  // ─── POSTS DE GENERAL ───────────────────────────────────
  loadGeneralPosts() {
    // Los posts de General se guardan con forum_name === 'General'
    const all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    this.generalPosts = all
      .filter((p: any) => p.forum_name === 'General')
      .reverse();
  }

  loadTests() {
    const data = localStorage.getItem('availableTests');
    this.availableTests = data ? JSON.parse(data) : [];
  }

// Replace startTest()
  startTest(test: any) {
    const id = test.test_id || test.id;
    if (id) this.router.navigate(['/do-test', id]);
  }

// Add deleteTest()
  deleteTest(test: any) {
    if (!confirm('¿Eliminar este test?')) return;
    const id = test.test_id || test.id;
    this.availableTests = this.availableTests.filter(
      (t: any) => (t.test_id || t.id) !== id
    );
    localStorage.setItem('availableTests', JSON.stringify(this.availableTests));
  }

// Add goToCreateTest()
  goToCreateTest() {
    this.router.navigate(['/create-test']);
  }

  publishPost() {
    const text = this.newPostText?.nativeElement.value.trim();
    if (!text && !this.attachedFile) return;

    const all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const newPost: any = {
      post_id: 'post_' + Date.now(),
      author_id: parseInt(this.currentUserId),
      author_name: 'Yo',
      forum_name: 'General',   // <-- siempre General desde la barra principal
      Description: text || '',
      Likes: 0,
      likedByMe: false,
      replies: [],
      created_at: new Date().toISOString()
    };

    if (this.attachedImageData) newPost.imageData = this.attachedImageData;
    if (this.attachedPdfName)  newPost.pdfName  = this.attachedPdfName;

    all.push(newPost);
    localStorage.setItem('myCustomPosts', JSON.stringify(all));

    // Limpia
    this.newPostText.nativeElement.value = '';
    this.removeAttachment();
    this.loadGeneralPosts();
  }

  deletePost(id: string) {
    if (!confirm('¿Borrar esta publicación?')) return;
    let all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    all = all.filter((p: any) => p.post_id !== id);
    localStorage.setItem('myCustomPosts', JSON.stringify(all));
    this.loadGeneralPosts();
  }

  // ─── LIKES ──────────────────────────────────────────────
  toggleLike(postId: string) {
    const all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const idx = all.findIndex((p: any) => p.post_id === postId);
    if (idx !== -1 && all[idx].author_id !== +this.currentUserId) {
      all[idx].likedByMe = !all[idx].likedByMe;
      all[idx].Likes = all[idx].likedByMe
        ? all[idx].Likes + 1
        : Math.max(0, all[idx].Likes - 1);
      localStorage.setItem('myCustomPosts', JSON.stringify(all));
      this.loadGeneralPosts();
    }
  }

  // ─── REPLIES ────────────────────────────────────────────
  toggleReplies(postId: string) {
    this.expandedReplies[postId] = !this.expandedReplies[postId];
  }

  submitReply(postId: string) {
    const content = this.replyInputs[postId]?.trim();
    if (!content) return;
    const all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const idx = all.findIndex((p: any) => p.post_id === postId);
    if (idx !== -1) {
      all[idx].replies.push({
        author_id: +this.currentUserId,
        author_name: 'Yo',
        content,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('myCustomPosts', JSON.stringify(all));
      this.replyInputs[postId] = '';
      this.expandedReplies[postId] = true;
      this.loadGeneralPosts();
    }
  }

  deleteReply(postId: string, replyIndex: number) {
    if (!confirm('¿Borrar este comentario?')) return;
    const all = JSON.parse(localStorage.getItem('myCustomPosts') || '[]');
    const idx = all.findIndex((p: any) => p.post_id === postId);
    if (idx !== -1) {
      all[idx].replies.splice(replyIndex, 1);
      localStorage.setItem('myCustomPosts', JSON.stringify(all));
      this.loadGeneralPosts();
    }
  }

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

  // ─── PERFIL USUARIO ──────────────────────────────────────
  openUserProfile(user: any) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  // ─── POPUP MENÚ + ────────────────────────────────────────
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
}
