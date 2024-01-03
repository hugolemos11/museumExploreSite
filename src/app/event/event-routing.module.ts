import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './event.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';

const routes: Routes = [
  { path: '', component: EventComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'delete-event', component: DeleteEventComponent },
  { path: 'list-event', component: ListEventComponent},
  { path: 'update-event', component: UpdateEventComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
