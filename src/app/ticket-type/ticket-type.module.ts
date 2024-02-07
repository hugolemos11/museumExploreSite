import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketTypeRoutingModule } from './ticket-type-routing.module';
import { TicketTypeComponent } from './ticket-type.component';
import { UpdateTicketTypeComponent } from './update-ticket-type/update-ticket-type.component';
import { DeleteTicketTypeComponent } from './delete-ticket-type/delete-ticket-type.component';
import { CreateTicketTypeComponent } from './create-ticket-type/create-ticket-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TicketTypeComponent,
    UpdateTicketTypeComponent,
    DeleteTicketTypeComponent,
    CreateTicketTypeComponent
  ],
  imports: [
    CommonModule,
    TicketTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    UpdateTicketTypeComponent,
    DeleteTicketTypeComponent,
    CreateTicketTypeComponent
  ]
})
export class TicketTypeModule { }
