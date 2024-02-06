import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './collection.component';
import { CreateArtworkComponent } from './create-artwork/create-artwork.component';
import { DeleteArtworkComponent } from './delete-artwork/delete-artwork.component';
import { UpdateArtworkComponent } from './update-artwork/update-artwork.component';
import { ListArtworkComponent } from './list-artwork/list-artwork.component';
import { CategoryModule } from '../category/category.module';
import { AddimagesArtworkComponent } from './addimages-artwork/addimages-artwork.component';

@NgModule({
  declarations: [
    CollectionComponent,
    CreateArtworkComponent,
    DeleteArtworkComponent,
    UpdateArtworkComponent,
    ListArtworkComponent,
    AddimagesArtworkComponent,
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryModule
  ],
})
export class CollectionModule { }
