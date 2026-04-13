import { Routes } from '@angular/router';
import {IndexComponent} from './index';
import {Login} from './login/login';
import {CreateAnAccount} from './create-an-account/create-an-account';
import {OurTeam} from './our-team/our-team';
import {ForgotYourPassword} from './forgot-your-password/forgot-your-password';

export const routes: Routes = [
  {path: "", component: IndexComponent},
  {path: "login", component: Login},
  {path: "create-an-account", component: CreateAnAccount},
  {path: "our-team", component: OurTeam},
  {path: "forgot-your-password", component: ForgotYourPassword},
];
