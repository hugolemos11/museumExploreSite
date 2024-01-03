import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './museums/museums.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/home', pathMatch: 'full' },
  { path: 'museums', loadChildren: () => import('./museums/museums.module').then(m => m.MuseumsModule) },
  { path: 'logn', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'collection', loadChildren: () => import('./collection/collection.module').then(m => m.CollectionModule) },
  { path: 'event', loadChildren: () => import('./event/event.module').then(m => m.EventModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
