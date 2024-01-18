import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './collection.component';
import { CreateArtworkComponent } from './create-artwork/create-artwork.component';
import { DeleteArtworkComponent } from './delete-artwork/delete-artwork.component';
import { UpdateArtworkComponent } from './update-artwork/update-artwork.component';
import { ListArtworkComponent } from './list-artwork/list-artwork.component';
import { MatButtonModule } from '@angular/material/button';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


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
    MatButtonModule,
    NgxMasonryModule,
    MatIconModule,
    MatInputModule
  ]
})
export class CollectionModule { }
