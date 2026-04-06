import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {Resum} from './components/home/resum/resum';

export const routes: Routes = [
  { path: '', component: Home, },
  { path: 'resume', component: Resum },
];
