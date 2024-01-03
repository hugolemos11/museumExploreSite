import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MuseumsRoutingModule } from './museums-routing.module';
import { MuseumsComponent } from './museums.component';
import { HeaderComponent } from '../common-site/header/header.component';


@NgModule({
  declarations: [
    MuseumsComponent,
  ],
  imports: [
    CommonModule,
    MuseumsRoutingModule,
    
  ],
  exports: [
    MuseumsComponent
  ]
})
export class MuseumsModule { }
