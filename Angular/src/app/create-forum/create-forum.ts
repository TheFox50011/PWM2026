import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, AsideComponent],
  templateUrl: './create-forum.html',
  styleUrl: './create-forum.css',
})
export class CreateForum {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  forumTitle: string = '';
  forumDescription: string = '';
  selectedCategory: string = 'general';
  selectedVisibility: string = 'public';
  tagInput: string = '';
  tags: string[] = [];

  constructor(private router: Router) {}

  addTag(): void {
    const value = this.tagInput.trim();
    if (value && !this.tags.includes(value) && this.tags.length < 8) {
      this.tags.push(value);
    }
    this.tagInput = '';
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addTag(); }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  async saveForum(): Promise<void> {
    if (!this.forumTitle.trim() || !this.forumDescription.trim()) {
      alert('Por favor, completa el título y la descripción.');
      return;
    }

    const currentUser = this.auth.currentUser;
    const newForum = {
      forum_title: this.forumTitle.trim(),
      forum_description: this.forumDescription.trim(),
      author_id: currentUser?.uid || null,
      created_at: new Date().toISOString(),
      category: this.selectedCategory,
      visibility: this.selectedVisibility,
      tags: this.tags,
    };

    await addDoc(collection(this.firestore, 'forums'), newForum);
    alert(`Foro "${newForum.forum_title}" creado con éxito.`);
    this.router.navigate(['/mainpage']);
  }
}
