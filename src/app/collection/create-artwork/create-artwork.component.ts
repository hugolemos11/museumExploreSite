import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Artwork } from '../artwork';
import { Observable } from 'rxjs';
import { ArtworkService } from '../artwork.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-create-artwork',
  templateUrl: './create-artwork.component.html',
  styleUrl: './create-artwork.component.css'
})
export class CreateArtworkComponent {

  @Input() museumId: string;
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  artWork: Artwork;
  artWorkImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  createArtWorkForm: FormGroup;

  @ViewChild('closeCreateModal') closeCreateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private artWorkService: ArtworkService, private categoryService: CategoryService) {
    this.museumId = '';
    this.createArtWorkForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      year: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.artWork = {
      id: '',
      artist: '',
      categoryId: '',
      description: '',
      museumId: '',
      name: '',
      pathToImage: '',
      year: 0,
      image: ''
    };
  }

  createArtWork() {
    if (this.createArtWorkForm.valid) {
      try {
        //call service
        this.artWorkService.createArtWork(this.artWork).then((result) => {
          const fileNameSplit = this.file.name.split('.');
          this.artWork.id = result.id;
          this.artWork.museumId = this.museumId;
          this.artWork.pathToImage = 'artWorksImages/' + this.artWork.id + '.' + fileNameSplit[fileNameSplit.length - 1];
          this.artWorkService.uploadFile(this.artWork.pathToImage, this.file);
          this.artWorkService.updateArtWork(this.artWork);
          this.closeCreateModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }

    } else {
      // Handle invalid form
      this.createArtWorkForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.createArtWorkForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.createArtWorkForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadMuseumId(museumId: string) {
    if (museumId !== undefined) {
      this.museumId = museumId;
      this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(this.museumId);
    } else {
      console.log('Museum ID is undefined. Error.');
    }
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    this.file = event.target.files[0];

    if (this.file) {
      const maxSizeInBytes = 1024 * 1024; // 1 MB
      if (this.file.size > maxSizeInBytes) {
        alert('File size exceeds the limit (1 MB). Please choose a smaller file.');
        // Optionally, you can reset the input value to clear the selected file
        event.target.value = '';
        return;
      }

      // Use FileReader to read the selected file and update the image source
      const reader = new FileReader();

      reader.onload = (e) => {
        this.artWorkImage = e.target?.result as string;
      };

      reader.readAsDataURL(this.file);
    } else {
      // present the current image
      this.loadImage();
    }
  }

  loadImage() {
    const imageObservable = this.artWorkService.downloadFile(this.artWork.pathToImage);
    imageObservable.subscribe(
      image => {
        this.artWorkImage = image;
      },
      error => {
        console.error(error);
        this.artWorkImage = './assets/imgs/defaultImage.png';
      }
    );
  }
}
