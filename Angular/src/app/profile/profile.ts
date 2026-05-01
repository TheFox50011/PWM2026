import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  user_id: number;
  username: string;
  email: string;
  Followers: string;
  Following: string;
  Biography: string;
  Profile_picture: string;
  link_1?: string;
  link_2?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profilePicture: string = 'assets/dummy_picture.jpeg';
  userName: string = 'Cargando...';
  followers: string = '...';
  following: string = '...';
  email: string = '';
  biography: string = '';
  link1: string = '';
  link2: string = '';

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    const userId = localStorage.getItem('loggedUserId') || '1';
    try {
      const response = await fetch('assets/users.json');
      const defaultUsers: User[] = await response.json();
      const localUsers: User[] = JSON.parse(localStorage.getItem('myRegisteredUsers') || '[]');
      const allUsers = [...defaultUsers, ...localUsers];
      const currentUser = allUsers.find(u => u.user_id == parseInt(userId));

      if (currentUser) {
        this.userName = currentUser.username;
        this.followers = currentUser.Followers;
        this.following = currentUser.Following;
        this.email = currentUser.email;
        this.biography = currentUser.Biography;
        this.link1 = currentUser.link_1 || '';
        this.link2 = currentUser.link_2 || '';
        if (currentUser.Profile_picture) {
          this.profilePicture = currentUser.Profile_picture.replace('../', '');
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  }
}
