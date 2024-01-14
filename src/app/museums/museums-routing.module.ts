import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './museums.component';
import { CreateMuseumComponent } from './create-museum/create-museum.component';
import { ListMuseumComponent } from './list-museum/list-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';

const routes: Routes = [
  { path: '', component: MuseumsComponent },
  { path: 'create-museum', component: CreateMuseumComponent },
  { path: 'list-museum', component: ListMuseumComponent },
  { path: 'update-museum', component: UpdateMuseumComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MuseumsRoutingModule { }
