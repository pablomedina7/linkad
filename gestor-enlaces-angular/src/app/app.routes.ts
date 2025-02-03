import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LinkDetailComponent } from './components/link-detail/link-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'link/:id', component: LinkDetailComponent },
];
