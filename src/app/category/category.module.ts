import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListCategoryComponent } from './list-category/list-category.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { UpdateCategoryComponent } from './update-category/update-category.component';



@NgModule({
  declarations: [
    CategoryComponent,
    CreateCategoryComponent,
    DeleteCategoryComponent,
    ListCategoryComponent,
    UpdateCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule
  ],
  exports: [
    CreateCategoryComponent,
    DeleteCategoryComponent,
    ListCategoryComponent,
    UpdateCategoryComponent
  ]
})
export class CategoryModule { }
