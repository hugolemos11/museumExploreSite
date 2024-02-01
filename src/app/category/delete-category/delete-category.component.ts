import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css'
})
export class DeleteCategoryComponent {

  @Input() categoryId: string;
  errorMessage: string;

  @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef;

  constructor(private categoryService: CategoryService) {
    this.categoryId = '';
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('deleteCategoryModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        // Reset the errorMessage when the modal is hidden
        this.errorMessage = '';
      });
    } else {
      console.error('Modal element not found.');
    }
  }

  loadCategoryId(categoryId: string) {
    if (categoryId !== undefined) {
      this.categoryId = categoryId;
    } else {
      console.log('Category ID is undefined. Error.');
    }
  }

  deleteCategory() {
    try {
      //call service
      this.categoryService.deleteCategory(this.categoryId)
        .then(() => {
          this.closeDeleteModal.nativeElement.click();
        })
        .catch(error => {
          this.errorMessage = error.message;
        });

    } catch (error) {
      console.error(error);
    }
  }
}
