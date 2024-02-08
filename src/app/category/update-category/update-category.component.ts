import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Category } from '../category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent implements AfterViewInit {

  @Input() category: Category;
  updateCategoryForm: FormGroup;
  errorMessage: string;

  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService) {
    this.updateCategoryForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
    this.category = {
      id: '',
      museumId: '',
      description: '',
    };
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('createCategoryModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        // Reset the errorMessage when the modal is hidden
        this.errorMessage = '';
      });
    } else {
      console.error('Modal element not found.');
    }
  }

  updateCategory() {
    if (this.updateCategoryForm.valid) {
      try {
        //call service
        this.categoryService.updateCategory(this.category)
          .then(() => {
            this.closeUpdateModal.nativeElement.click();
          })
          .catch(error => {
            this.errorMessage = error.message;
          });
      } catch (error) {
        console.error(error);
      }

    } else {
      // Handle invalid form
      this.updateCategoryForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.updateCategoryForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.updateCategoryForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadCategory(categoryId: string) {
    if (categoryId !== undefined) {
      this.categoryService.getCategoryById(categoryId).subscribe((data) => {
        if (data?.id !== '') {
          this.category = {
            id: categoryId,
            museumId: data.museumId,
            description: data.description
          };
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching category data:', error);
      });
    } else {
      console.log('Art Work ID is undefined. Error.');
    }
  }
}
