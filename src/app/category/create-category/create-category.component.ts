import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Category } from '../category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {

  @Input() museumId: string;
  category: Category;
  createCategoryForm: FormGroup;

  @ViewChild('closeCreateModal') closeCreateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService) {
    this.museumId = '';
    this.createCategoryForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
    this.category = {
      id: '',
      museumId: '',
      description: '',
    };
  }

  createCategory() {
    if (this.createCategoryForm.valid) {
      try {
        //call service
        this.categoryService.createCategory(this.category).then((result) => {
          this.category.id = result.id;
          this.category.museumId = this.museumId;
          this.categoryService.updateCategory(this.category);
          this.closeCreateModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle invalid form
      this.createCategoryForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.createCategoryForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.createCategoryForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadMuseumId(museumId: string) {
    if (museumId !== undefined) {
      this.museumId = museumId;
      console.log(this.museumId)
    } else {
      console.log('Museum ID is undefined. Error.');
    }
  }
}
