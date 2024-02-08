import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MuseumsRoutingModule } from './museums-routing.module';
import { MuseumsComponent } from './museums.component';
import { CreateMuseumComponent } from './create-museum/create-museum.component';
import { ListMuseumComponent } from './list-museum/list-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { TicketTypeModule } from '../ticket-type/ticket-type.module';


@NgModule({
  declarations: [
    MuseumsComponent,
    CreateMuseumComponent,
    ListMuseumComponent,
    UpdateMuseumComponent
  ],
  imports: [
    CommonModule,
    MuseumsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    TicketTypeModule
  ],
  exports: [
    MuseumsComponent
  ]
})
export class MuseumsModule { }
