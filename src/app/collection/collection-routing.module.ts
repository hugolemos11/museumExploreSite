import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection.component';
import { CreateArtworkComponent } from './create-artwork/create-artwork.component';
import { UpdateArtworkComponent } from './update-artwork/update-artwork.component';
import { DeleteArtworkComponent } from './delete-artwork/delete-artwork.component';
import { ListArtworkComponent } from './list-artwork/list-artwork.component';

const routes: Routes = [
  { path: '', component: CollectionComponent },
  { path: 'create-artwork', component: CreateArtworkComponent },
  { path: 'delete-artwork', component: DeleteArtworkComponent },
  { path: 'list-artwork', component: ListArtworkComponent },
  { path: 'update-artwork', component: UpdateArtworkComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
