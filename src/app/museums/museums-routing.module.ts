import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuseumsComponent } from './museums.component';
import { CreateMuseumComponent } from './create-museum/create-museum.component';
import { ListEventComponent } from '../event/list-event/list-event.component';
import { UpdateEventComponent } from '../event/update-event/update-event.component';

const routes: Routes = [
  { path: '', component: MuseumsComponent },
  { path: 'create-event', component: CreateMuseumComponent },
  { path: 'list-event', component: ListEventComponent},
  { path: 'update-event', component: UpdateEventComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MuseumsRoutingModule { }
