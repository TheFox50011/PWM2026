import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';

interface PostFile {
  fileName: string;
  fileSrc: string;
}

interface Post {
  post_id: string;
  author_id: number;
  author_name?: string;
  author_img?: string;
  forum_name: string;
  Description: string;
  Likes: number;
  Dislikes?: number;
  files: PostFile[];
}

interface Forum {
  forum_id?: string;
  forum_title: string;
  forum_description?: string;
  author_id?: number;
  created_at?: string;
}

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, AsideComponent, RouterLink],
  templateUrl: './mainpage.html',
  styleUrl: './mainpage.css',
})
export class Mainpage implements OnInit {
  @ViewChild('newPostText') newPostText!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('attachmentPreview') attachmentPreview!: ElementRef;
  @ViewChild('attachmentName') attachmentName!: ElementRef;
  @ViewChild('watchlist' +
    'Container') watchlistContainer!: ElementRef;
  @ViewChild('profilePictureSmall') profilePictureSmall!: ElementRef;
  @ViewChild('searchAvatar') searchAvatar!: ElementRef;
  @ViewChild('searchInputEl') searchInputEl!: ElementRef;

  attachedFile: File | null = null;
  customForums: Forum[] = [];
  posts: Post[] = [];
  allPosts: Post[] = [];
  currentUserId: string = '1';
  forumFilter: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('loggedUserId') || '1';
    const params = new URLSearchParams(window.location.search);
    this.forumFilter = params.get('forum') || 'dummy forum';
    this.loadCustomForums();
    this.loadPosts();
    this.loadMainpageAvatars();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    const postBodies = document.querySelectorAll('#post-body');
    postBodies.forEach((post) => {
      const text = post.textContent?.toLowerCase() || '';
      (post as HTMLElement).style.display = text.includes(term) ? '' : 'none';
    });
    const widgetCards = document.querySelectorAll('.widget-card');
    widgetCards.forEach((user) => {
      const text = user.textContent?.toLowerCase() || '';
      (user as HTMLElement).style.display = text.includes(term) ? '' : 'none';
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
    const addMenu = document.querySelector('.add-popup-menu') as HTMLElement;
    if (addMenu) addMenu.style.display = 'none';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachedFile = input.files[0];
      this.attachmentName.nativeElement.textContent = this.attachedFile.name;
      this.attachmentPreview.nativeElement.style.display = 'block';
    }
  }

  removeAttachment(): void {
    this.attachedFile = null;
    this.fileInput.nativeElement.value = '';
    this.attachmentPreview.nativeElement.style.display = 'none';
  }

  toggleAddMenu(btn: HTMLElement, event: Event): void {
    event.stopPropagation();
    const menu = btn.nextElementSibling as HTMLElement;
    if (!menu) return;
    if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'flex';
    } else {
      menu.style.display = 'none';
    }
  }

  publishPost(): void {
    const text = this.newPostText.nativeElement.value.trim();
    if (!text && !this.attachedFile) {
      alert("Por favor, escribe algo o adjunta un archivo antes de publicar.");
      return;
    }

    let filesArray: PostFile[] = [];

    if (this.attachedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filesArray.push({
          fileName: this.attachedFile!.name,
          fileSrc: e.target?.result as string
        });
        this.saveAndReloadPost(text, filesArray);
      };
      reader.readAsDataURL(this.attachedFile);
    } else {
      this.saveAndReloadPost(text, filesArray);
    }
  }

  private saveAndReloadPost(text: string, filesArray: PostFile[]): void {
    const newPost: Post = {
      post_id: 'custom_' + Date.now(),
      author_id: parseInt(this.currentUserId),
      forum_name: this.forumFilter,
      Description: text || 'Archivo adjunto:',
      Likes: 0,
      files: filesArray
    };

    const customPosts = this.getCustomPosts();
    customPosts.push(newPost);

    try {
      localStorage.setItem('myCustomPosts', JSON.stringify(customPosts));
      window.location.reload();
    } catch (err) {
      alert("Error al guardar.");
    }
  }

  private getCustomPosts(): Post[] {
    const stored = localStorage.getItem('myCustomPosts');
    return stored ? JSON.parse(stored) : [];
  }

  loadCustomForums(): void {
    const stored = localStorage.getItem('myCustomForums');
    this.customForums = stored ? JSON.parse(stored) : [];

    if (this.watchlistContainer?.nativeElement) {
      const container = this.watchlistContainer.nativeElement;
      if (this.customForums.length > 0) {
        container.innerHTML = '';
        this.customForums.forEach((forum) => {
          const watchCard = document.createElement('div');
          watchCard.className = 'card';
          watchCard.style.cssText = `
            cursor: pointer;
            background-color: #e0f7fa;
            border: 2px dashed #00796b;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px;
            color: #00796b;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.2s;
          `;
          watchCard.innerHTML = `<span style="font-size: 24px;">📁</span><span>${forum.forum_title}</span>`;
          watchCard.onmouseover = () => {
            watchCard.style.transform = 'scale(1.05)';
            watchCard.style.backgroundColor = '#b2ebf2';
          };
          watchCard.onmouseout = () => {
            watchCard.style.transform = 'scale(1)';
            watchCard.style.backgroundColor = '#e0f7fa';
          };
          watchCard.onclick = () => {
            this.router.navigate(['/mainpage'], { queryParams: { forum: forum.forum_title } });
          };
          container.appendChild(watchCard);
        });
      } else {
        container.innerHTML = '<p style="color: #888; font-size: 14px; text-align: center; width: 100%;">Aún no tienes foros en tu Watchlist.</p>';
      }
    }
  }

  async loadMainpageAvatars(): Promise<void> {
    try {
      const response = await fetch('assets/users.json');
      const defaultUsers = await response.json();
      const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers') || '[]');
      const allUsers = [...defaultUsers, ...localUsers];

      const currentUser = allUsers.find((u: any) => u.user_id == this.currentUserId);
      if (currentUser?.Profile_picture && this.profilePictureSmall?.nativeElement) {
        const fotoPath = currentUser.Profile_picture.includes('/')
          ? currentUser.Profile_picture
          : `../assets/${currentUser.Profile_picture}`;
        this.profilePictureSmall.nativeElement.src = fotoPath;
      }

      if (currentUser?.Profile_picture && this.searchAvatar?.nativeElement) {
        const fotoPath = currentUser.Profile_picture.includes('/')
          ? currentUser.Profile_picture
          : `../assets/${currentUser.Profile_picture}`;
        this.searchAvatar.nativeElement.style.backgroundImage = `url('${fotoPath}')`;
      }

      const widgetCards = document.querySelectorAll('.widget-card');
      widgetCards.forEach((card) => {
        const onclickText = card.getAttribute('onclick');
        if (onclickText) {
          const idMatch = onclickText.match(/id=(\d+)/);
          if (idMatch && idMatch[1]) {
            const targetUser = allUsers.find((u: any) => u.user_id == idMatch[1]);
            if (targetUser?.Profile_picture) {
              const fotoPath = targetUser.Profile_picture.includes('/')
                ? targetUser.Profile_picture
                : `../assets/${targetUser.Profile_picture}`;
              (card as HTMLElement).style.backgroundImage = `url('${fotoPath}')`;
            }
          }
        }
      });
    } catch (error) {
      console.error("Error cargando avatares:", error);
    }
  }

  loadPosts(): void {
    this.allPosts = this.getCustomPosts();
  }

  togglePostMenu(btn: HTMLElement, event: Event): void {
    event.stopPropagation();
    const menu = btn.nextElementSibling as HTMLElement;

    document.querySelectorAll('.post-popup-menu').forEach((m) => {
      if (m !== menu) (m as HTMLElement).style.display = 'none';
    });

    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
  }

  toggleLike(postId: string, event: Event): void {
    const btn = event.target as HTMLElement;
    const footer = btn.closest('#post-footer') as HTMLElement;
    if (!footer) return;

    const amountDiv = footer.querySelector('#like-amount') as HTMLElement;
    const dislikeBtn = footer.querySelector('.dislike-btn') as HTMLElement;
    let currentLikes = parseInt(amountDiv.textContent || '0');

    if (!btn.classList.contains('active')) {
      if (dislikeBtn?.classList.contains('active')) {
        dislikeBtn.classList.remove('active');
        dislikeBtn.style.opacity = '1';
        currentLikes += 1;
      }
      amountDiv.textContent = (currentLikes + 1).toString();
      btn.classList.add('active');
      btn.style.transform = 'scale(1.3)';
    } else {
      amountDiv.textContent = (currentLikes - 1).toString();
      btn.classList.remove('active');
      btn.style.transform = 'scale(1)';
    }

    this.updatePostInStorage(postId, { Likes: parseInt(amountDiv.textContent || '0') });
  }

  toggleDislike(postId: string, event: Event): void {
    const btn = event.target as HTMLElement;
    const footer = btn.closest('#post-footer') as HTMLElement;
    if (!footer) return;

    const amountDiv = footer.querySelector('#like-amount') as HTMLElement;
    const likeBtn = footer.querySelector('.like-btn') as HTMLElement;
    let currentLikes = parseInt(amountDiv.textContent || '0');

    if (!btn.classList.contains('active')) {
      if (likeBtn?.classList.contains('active')) {
        likeBtn.classList.remove('active');
        likeBtn.style.transform = 'scale(1)';
        currentLikes -= 1;
      }
      amountDiv.textContent = (currentLikes - 1).toString();
      btn.classList.add('active');
      btn.style.opacity = '0.4';
    } else {
      amountDiv.textContent = (currentLikes + 1).toString();
      btn.classList.remove('active');
      btn.style.opacity = '1';
    }

    this.updatePostInStorage(postId, { Likes: parseInt(amountDiv.textContent || '0') });
  }

  toggleFavorite(postCard: HTMLElement, btn: HTMLElement, event: Event): void {
    event.stopPropagation();
    const postId = postCard.dataset['postId'] || '';
    const isFavorited = btn.dataset['favorited'] === 'true';
    let allFavorites: Record<string, Post[]> = JSON.parse(localStorage.getItem('myUserFavorites') || '{}');

    if (!allFavorites[this.currentUserId]) {
      allFavorites[this.currentUserId] = [];
    }

    if (isFavorited) {
      allFavorites[this.currentUserId] = allFavorites[this.currentUserId].filter(fav => fav.post_id !== postId);
      localStorage.setItem('myUserFavorites', JSON.stringify(allFavorites));
      btn.innerHTML = '⭐ Añadir a Favoritos';
      btn.dataset['favorited'] = 'false';
    } else {
      const description = (postCard.querySelector('#post-description') as HTMLElement)?.innerText || '';
      const authorName = (postCard.querySelector('#profile-name') as HTMLElement)?.innerText || '';
      const authorImg = (postCard.querySelector('#profile-photo') as HTMLImageElement)?.src || '';
      const likes = (postCard.querySelector('#like-amount') as HTMLElement)?.innerText || '0';

      const filesArray: PostFile[] = [];
      const filesDiv = postCard.querySelector('#files');
      if (filesDiv) {
        filesDiv.querySelectorAll('.embedded-file').forEach((fileLink) => {
          filesArray.push({
            fileName: fileLink.textContent || '',
            fileSrc: (fileLink as HTMLAnchorElement).href
          });
        });
      }

      const favoritePost: Post = {
        post_id: postId,
        author_id: parseInt(this.currentUserId),
        forum_name: this.forumFilter,
        Description: description,
        author_name: authorName,
        author_img: authorImg,
        Likes: parseInt(likes),
        files: filesArray
      };

      allFavorites[this.currentUserId].push(favoritePost);
      localStorage.setItem('myUserFavorites', JSON.stringify(allFavorites));
      btn.innerHTML = '❌ Quitar de Favoritos';
      btn.dataset['favorited'] = 'true';
    }

    (btn.closest('.post-popup-menu') as HTMLElement).style.display = 'none';
  }

  private updatePostInStorage(postId: string, updates: Partial<Post>): void {
    const customPosts = this.getCustomPosts();
    const index = customPosts.findIndex(p => p.post_id === postId);
    if (index !== -1) {
      customPosts[index] = { ...customPosts[index], ...updates };
      localStorage.setItem('myCustomPosts', JSON.stringify(customPosts));
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const addMenu = document.querySelector('.add-popup-menu') as HTMLElement;
    if (addMenu && !document.querySelector('.add-btn-container')?.contains(event.target as Node)) {
      addMenu.style.display = 'none';
    }

    if (!(event.target as HTMLElement).closest('#post_options') && !(event.target as HTMLElement).closest('.post-popup-menu')) {
      document.querySelectorAll('.post-popup-menu').forEach(m => (m as HTMLElement).style.display = 'none');
    }
  }
}
