import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Artwork } from '../artwork';
import { Observable, forkJoin, map, mergeAll, mergeMap } from 'rxjs';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';
import { AuthService } from '../../auth/auth.service';
import { UpdateArtworkComponent } from '../update-artwork/update-artwork.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-artwork',
  templateUrl: './list-artwork.component.html',
  styleUrl: './list-artwork.component.css'
})
export class ListArtworkComponent implements OnInit {

  constructor(private artWorkService: ArtworkService, private categoryService: CategoryService, private authService: AuthService, private formBuilder: FormBuilder) { }

  artWorksData$: Observable<Array<Artwork>> = new Observable<Array<Artwork>>;
  artworkImages: string[] = [];
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  loginForm: FormGroup | undefined;

  ngOnInit(): void {
    this.fetchData();

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

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON)
      if (userData.museumId != null) {

        this.artWorksData$ = this.artWorkService.getAllArtWorksFromMuseum(userData.museumId);
        this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(userData.museumId);

        // Subscribe to the observables to get the data
        this.artWorksData$.subscribe(artWorksData => {
          if (artWorksData != null) {
            console.log(artWorksData);
            this.loadImages();
          }
        });
        this.categoriesData$.subscribe(categoriesData => {
          console.log(categoriesData);
        });
      } else {
        console.log('UserData museumId is null!');
      }
    }
  }

  public loadImages() {
    this.artWorksData$.pipe(
      map((artworks: Artwork[]) => {
        const artWorksDatalength = artworks.length
        artworks.map((artwork: Artwork) => {
          const imageObservable = this.artWorkService.downloadFile(artwork.pathToImage);
          imageObservable.subscribe(
            imageArray => {
              this.artworkImages.push(imageArray);
            },
            error => {
              console.error(error);
              this.artworkImages = Array(artWorksDatalength).fill('../../assets/imgs/museu1.jpg');
            }
          )
        })
      }),
    ).subscribe();
  }
}
