import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './museums/museums.component';

const routes: Routes = [
  { path: 'sobreMuseu', component: MuseumsComponent},
  { path: 'museums', loadChildren: () => import('./museums/museums.module').then(m => m.MuseumsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
