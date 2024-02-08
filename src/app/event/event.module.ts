import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EventComponent,
    CreateEventComponent,
    UpdateEventComponent,
    ListEventComponent,
    DeleteEventComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class EventModule { }
