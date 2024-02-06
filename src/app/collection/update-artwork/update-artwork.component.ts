import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Artwork } from '../artwork';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtworkService } from '../artwork.service';
import { DeleteArtworkComponent } from '../delete-artwork/delete-artwork.component';
import { Observable } from 'rxjs';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-update-artwork',
  templateUrl: './update-artwork.component.html',
  styleUrl: './update-artwork.component.css',
})
export class UpdateArtworkComponent {
  @Input() artWork: Artwork;
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  artWorkImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  updateArtWorkForm: FormGroup;

  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  @ViewChild(DeleteArtworkComponent) deleteComponent!: DeleteArtworkComponent;

  constructor(private formBuilder: FormBuilder, private artWorkService: ArtworkService, private categoryService: CategoryService) {

    this.updateArtWorkForm = this.formBuilder.group({
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

  updateArtWork() {
    if (this.updateArtWorkForm.valid) {
      try {

        //call service
        this.artWorkService.updateArtWork(this.artWork).then(() => {
          console.log('Update ArtWork completed');
          if (this.file.name !== '') {
            this.artWorkService.uploadFile(this.artWork.pathToImage, this.file);
          }
          this.closeUpdateModal.nativeElement.click();
        });

      } catch (error) {
        console.error(error);
      }

    } else {
      // Handle invalid form
      this.updateArtWorkForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.updateArtWorkForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.updateArtWorkForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadArtWork(artWorkId: string) {
    if (artWorkId !== undefined) {
      this.artWorkService.getArtWorkById(artWorkId).subscribe((data) => {
        if (data?.id !== '') {
          this.artWork = {
            id: artWorkId,
            artist: data.artist,
            categoryId: data.categoryId,
            description: data.description,
            museumId: data.museumId,
            name: data.name,
            pathToImage: data.pathToImage,
            year: data.year
          };
          this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(this.artWork.museumId);
          this.loadImage();
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching event data:', error);
      });
    } else {
      console.log('Art Work ID is undefined. Error.');
    }
  }

  setArtWorkId(event: any, artWorkId: string) {
    if (artWorkId !== undefined) {
      this.deleteComponent.loadArtWorkId(artWorkId)
    } else {
      console.log("erro");
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
