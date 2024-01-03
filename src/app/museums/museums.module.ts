import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MuseumsRoutingModule } from './museums-routing.module';
import { MuseumsComponent } from './museums.component';
import { CreateMuseumComponent } from './create-museum/create-museum.component';
import { ListMuseumComponent } from './list-museum/list-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';


@NgModule({
  declarations: [
    MuseumsComponent,
    CreateMuseumComponent,
    ListMuseumComponent,
    UpdateMuseumComponent
  ],
  imports: [
    CommonModule,
    MuseumsRoutingModule
  ],
  exports: [
    MuseumsComponent
  ]
})
export class MuseumsModule { }
