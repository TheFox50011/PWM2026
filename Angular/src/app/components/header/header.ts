import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink],
})
export class HeaderComponent implements OnInit {
  logo = '/logo.png';
  profilePicture: string = 'dummy_picture.jpeg';
  userName: string = 'User';

  ngOnInit(): void {
    this.loadProfileData();
  }

  async loadProfileData(): Promise<void> {
    const userId = localStorage.getItem('loggedUserId') || '1';
    try {
      const response = await fetch('assets/users.json');
      const defaultUsers = await response.json();
      const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers') || '[]');
      const allUsers = [...defaultUsers, ...localUsers];
      const currentUser = allUsers.find((u: any) => u.user_id == userId);

      if (currentUser) {
        this.userName = currentUser.username;
        if (currentUser.Profile_picture) {
          this.profilePicture = currentUser.Profile_picture.replace('../', '');
        }
      }
    } catch (error) {
      console.error('Error cargando datos del header:', error);
    }
  }
}
