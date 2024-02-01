import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';

const routes: Routes = [{ path: '', component: CategoryComponent },
{ path: 'create-category', component: CreateCategoryComponent },
{ path: 'delete-category', component: DeleteCategoryComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
