import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { ArtworkService } from '../artwork.service';
import { Artwork } from '../artwork';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';
import { AuthService } from '../../auth/auth.service';
import { UpdateArtworkComponent } from '../update-artwork/update-artwork.component';
import { CreateArtworkComponent } from '../create-artwork/create-artwork.component';
import { CreateCategoryComponent } from '../../category/create-category/create-category.component';
import { DeleteCategoryComponent } from '../../category/delete-category/delete-category.component';
import { ListCategoryComponent } from '../../category/list-category/list-category.component';

@Component({
  selector: 'app-list-artwork',
  templateUrl: './list-artwork.component.html',
  styleUrl: './list-artwork.component.css'
})
export class ListArtworkComponent implements OnInit {

<<<<<<< HEAD
  constructor(private artWorkService: ArtworkService, private categoryService: CategoryService, private authService: AuthService, private formBuilder: FormBuilder) { }

 
=======
>>>>>>> ba1efd122487be78405bc49f9776d6006e9ad4c8
  artWorksData$: Observable<Array<Artwork>> = new Observable<Array<Artwork>>;
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  categoriesData: Array<Category> = [];

  artWork: Artwork;
  museumId: string = '';

  @ViewChild(ListCategoryComponent) listCategoryComponent!: ListCategoryComponent;

  @ViewChild(CreateArtworkComponent) createComponent!: CreateArtworkComponent;
  @ViewChild(UpdateArtworkComponent) updateComponent!: UpdateArtworkComponent;

  constructor(private artWorkService: ArtworkService, private categoryService: CategoryService, private authService: AuthService) {
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

  isValid: any;
  other_content: any;

  ngOnInit(): void {
    this.fetchData();
<<<<<<< HEAD

    // Initialize the form group with form controls
    this.loginForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl(''), // You can set validators for description if needed
    });

    
}
  /*getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      this.service.SignIn(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
    } else {
      this.loginForm.markAllAsTouched();
      console.error('Form is invalid!');
    }
  }*/

  openModal() {
    // Access the modal and trigger its show method
    const modal = document.getElementById('myModal');
    console.log("teste")
    if (modal != null) {
      modal.style.display = 'block'
    }
  }

  openModalArte(){
    const modal = document.getElementById('modalArte');
    console.log("teste")
    if (modal != null) {
      modal.style.display = 'block'
    }
  }

  closeModal() {
    // Access the modal and trigger its show method
    const modal = document.getElementById('myModal');
    console.log("teste")
    if (modal != null) {
      modal.style.display = 'none'
    }
=======
>>>>>>> ba1efd122487be78405bc49f9776d6006e9ad4c8
  }

  changeDiv(){
    this.isValid =! this.other_content;
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON)
      if (userData.museumId != null) {
        this.museumId = userData.museumId;
        this.artWorksData$ = this.artWorkService.getAllArtWorksFromMuseum(userData.museumId).pipe(
          switchMap((artWorksData: Artwork[]) => {
            if (artWorksData != null) {
              const imageObservables = artWorksData.map((artwork: Artwork) =>
                this.artWorkService.downloadFile(artwork.pathToImage)
              );

              return forkJoin(imageObservables).pipe(
                map((imageArrays: string[]) => {
                  artWorksData.forEach((artwork, index) => {
                    artwork.image = imageArrays[index];
                  });
                  return artWorksData;
                })
              );
            } else {
              console.log('Art Works data is empty!');
              return [];
            }
          })
        );

        this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(userData.museumId);
        this.categoriesData$.subscribe((categoriesData) => {
          this.categoriesData = categoriesData;
        })
      } else {
        console.log('UserData museumId is null!');
      }
    }
  }

  getCategoryDescription(categoryId: string): string {
    if (this.categoriesData) {
      const matchingCategory = this.categoriesData.find(category => category.id === categoryId);

      if (matchingCategory) {
        return matchingCategory.description;
      }
    }

    return '';
  }

  setMuseumIdCategory(event: any) {
    if (this.museumId !== undefined) {
      this.listCategoryComponent.loadMuseumId(this.museumId);
    } else {
      console.log("erro");
    }
  }

  setMuseumId(event: any) {
    if (this.museumId !== undefined) {
      this.createComponent.loadMuseumId(this.museumId);
    } else {
      console.log("erro");
    }
  }

  setArtWork(event: any, artWork: Artwork) {
    if (artWork && artWork.id !== undefined) {
      this.updateComponent.loadArtWork(artWork.id);
    } else {
      console.log("erro");
    }
  }
}
