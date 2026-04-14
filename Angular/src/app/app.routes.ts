import { Routes } from '@angular/router';
import {IndexComponent} from './index';
import {Login} from './login/login';
import {CreateAnAccount} from './create-an-account/create-an-account';
import {OurTeam} from './our-team/our-team';
import {AboutUs} from './about-us/about-us';
import {ForgotYourPassword} from './forgot-your-password/forgot-your-password';
import {CreateForum} from './create-forum/create-forum';
import {Settings} from './settings/settings';
import {Profile} from './profile/profile';
import {Notifications} from './notifications/notifications';
import {Mainpage} from './mainpage/mainpage';
import {Favorites} from './favorites/favorites';

export const routes: Routes = [
  {path: "", component: IndexComponent},
  {path: "login", component: Login},
  {path: "create-an-account", component: CreateAnAccount},
  {path: "our-team", component: OurTeam},
  {path: "about-us", component: AboutUs},
  {path: "forgot-your-password", component: ForgotYourPassword},
  {path: "create-forum", component: CreateForum},
  {path: "settings", component: Settings},
  {path: "profile", component: Profile},
  {path: "notifications", component: Notifications},
  {path: "mainpage", component: Mainpage},
  {path: "favorites", component: Favorites},
];
