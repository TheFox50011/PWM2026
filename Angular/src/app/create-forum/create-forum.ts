import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';

interface Forum {
  forum_id: string;
  forum_title: string;
  forum_description: string;
  author_id: number;
  created_at: string;
  category: string;
  visibility: string;
  tags: string[];
}

@Component({
  selector: 'app-create-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, AsideComponent],
  templateUrl: './create-forum.html',
  styleUrl: './create-forum.css',
})
export class CreateForum implements OnInit {
  forumTitle: string = '';
  forumDescription: string = '';
  selectedCategory: string = 'general';
  selectedVisibility: string = 'public';
  tagInput: string = '';
  tags: string[] = [];
  currentUserId: string = '1';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('loggedUserId') || '1';
  }

  addTag(): void {
    const value = this.tagInput.trim();
    if (value && !this.tags.includes(value) && this.tags.length < 8) {
      this.tags.push(value);
    }
    this.tagInput = '';
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  saveForum(): void {
    if (!this.forumTitle.trim() || !this.forumDescription.trim()) {
      alert('Por favor, completa el título y la descripción.');
      return;
    }

    const newForum: Forum = {
      forum_id: 'forum_' + Date.now(),
      forum_title: this.forumTitle.trim(),
      forum_description: this.forumDescription.trim(),
      author_id: parseInt(this.currentUserId),
      created_at: new Date().toISOString(),
      category: this.selectedCategory,
      visibility: this.selectedVisibility,
      tags: this.tags,
    };

    const stored = localStorage.getItem('myCustomForums');
    const forums: Forum[] = stored ? JSON.parse(stored) : [];
    forums.push(newForum);
    localStorage.setItem('myCustomForums', JSON.stringify(forums));

    alert(`Foro "${newForum.forum_title}" creado con éxito.`);
    this.router.navigate(['/mainpage']);
  }
}
