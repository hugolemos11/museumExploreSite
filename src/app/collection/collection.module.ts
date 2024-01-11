import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './collection.component';
import { CreateArtworkComponent } from './create-artwork/create-artwork.component';
import { DeleteArtworkComponent } from './delete-artwork/delete-artwork.component';
import { UpdateArtworkComponent } from './update-artwork/update-artwork.component';
import { ListArtworkComponent } from './list-artwork/list-artwork.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    CollectionComponent,
    CreateArtworkComponent,
    DeleteArtworkComponent,
    UpdateArtworkComponent,
    ListArtworkComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    MatButtonModule
  ]
})
export class CollectionModule { }
