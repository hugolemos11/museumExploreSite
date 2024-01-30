import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MuseumsRoutingModule } from './museums-routing.module';
import { MuseumsComponent } from './museums.component';
import { CreateMuseumComponent } from './create-museum/create-museum.component';
import { ListMuseumComponent } from './list-museum/list-museum.component';
import { UpdateMuseumComponent } from './update-museum/update-museum.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoAdjustHeightDirective } from './auto-adjust-height.directive';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    MuseumsComponent,
    CreateMuseumComponent,
    ListMuseumComponent,
    UpdateMuseumComponent,
    AutoAdjustHeightDirective
  ],
  imports: [
    CommonModule,
    MuseumsRoutingModule,
    FormsModule,
    CarouselModule,
    ReactiveFormsModule
  ],
  exports: [
    MuseumsComponent
  ]
})
export class MuseumsModule { }
