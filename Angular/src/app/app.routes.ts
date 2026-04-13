import { Routes } from '@angular/router';
import {IndexComponent} from './index';
import {OurTeam} from './our-team/our-team';

export const routes: Routes = [
  {path: "", component: IndexComponent},
  {path: "our-team", component: OurTeam},

];
