import { Component, Input, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { Observable } from 'rxjs';
import { Category } from '../category';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';
import { UpdateCategoryComponent } from '../update-category/update-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css',
})
export class ListCategoryComponent {
  @Input() museumId: string;
  category: Category;
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(CreateCategoryComponent) createCategoryComponent!: CreateCategoryComponent;
  @ViewChild(UpdateCategoryComponent) updateCategoryComponent!: UpdateCategoryComponent;
  @ViewChild(DeleteCategoryComponent) deleteCategoryComponent!: DeleteCategoryComponent;

  constructor(private categoryService: CategoryService) {
    this.museumId = '';
    this.category = {
      id: '',
      museumId: '',
      description: '',
    };
  }

  loadMuseumId(museumId: string) {
    if (museumId !== undefined) {
      this.museumId = museumId;
      this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(this.museumId);
      // Subscribe to the data and update the data source and paginator when data is received
      this.categoriesData$.subscribe(categories => {
        this.dataSource.data = categories;
        this.dataSource.paginator = this.paginator;
      });
    } else {
      console.log('Museum ID is undefined. Error.');
    }
  }

  setMuseumId(event: any) {
    if (this.museumId !== undefined) {
      this.createCategoryComponent.loadMuseumId(this.museumId);
    } else {
      console.log("erro");
    }
  }

  setCategory(event: any, category: Category) {
    if (category && category.id !== undefined) {
      this.updateCategoryComponent.loadCategory(category.id);
    } else {
      console.log("erro");
    }
  }

  setCategoryId(event: any, categoryId: string) {
    if (categoryId !== undefined) {
      this.deleteCategoryComponent.loadCategoryId(categoryId);
    } else {
      console.log("erro");
    }
  }
}
