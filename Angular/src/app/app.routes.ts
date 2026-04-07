import { Routes } from '@angular/router';

// 1. Importamos todos tus componentes
import { LoginComponent } from './login/login';
import { CreateAnAccountComponent } from './create-an-account/create-an-account';
import { ForgotYourPasswordComponent } from './forgot-your-password/forgot-your-password';
import { MainpageComponent } from './mainpage/mainpage';
import { ProfileComponent } from './profile/profile';
import { EditProfileComponent } from './edit-profile/edit-profile';
import { CreateForumComponent } from './create-forum/create-forum';
import { CreateTestComponent } from './create-test/create-test';
import { DoTestComponent } from './do-test/do-test';
import { FavoritesComponent } from './favorites/favorites';
import { NotificationsComponent } from './notifications/notifications';
import { AboutUsComponent } from './about-us/about-us';
import { OurTeamComponent } from './our-team/our-team';
import { IndexComponent } from './index/index';

// 2. Definimos las rutas
export const routes: Routes = [
  // Ruta por defecto: Cuando el usuario entra a la raíz de tu web (http://localhost:4200/)
  // lo redirigimos automáticamente a la pantalla de login.
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Rutas de Acceso y Gestión de Cuenta
  { path: 'login', component: LoginComponent },
  { path: 'create-an-account', component: CreateAnAccountComponent },
  { path: 'forgot-your-password', component: ForgotYourPasswordComponent },

  // Rutas Principales y de Estudio
  { path: 'mainpage', component: MainpageComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'create-forum', component: CreateForumComponent },
  { path: 'create-test', component: CreateTestComponent },
  { path: 'do-test', component: DoTestComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'notifications', component: NotificationsComponent },

  // Rutas Informativas
  { path: 'about-us', component: AboutUsComponent },
  { path: 'our-team', component: OurTeamComponent },
  { path: 'index', component: IndexComponent },

  // Ruta comodín (Catch-all): Si el usuario escribe una URL que no existe,
  // lo enviamos de vuelta al login (o podrías crear un componente Error404Component).
  { path: '**', redirectTo: '/login' }
];
