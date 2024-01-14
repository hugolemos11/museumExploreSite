import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Artwork } from '../artwork';
import { Observable, forkJoin, map, mergeAll, mergeMap } from 'rxjs';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-artwork',
  templateUrl: './list-artwork.component.html',
  styleUrl: './list-artwork.component.css'
})
export class ListArtworkComponent implements OnInit {

  constructor(private artWorkService: ArtworkService, private categoryService: CategoryService, private authService: AuthService) { }

  artWorksData$: Observable<Array<Artwork>> = new Observable<Array<Artwork>>;
  artworkImages: string[] = [];
  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;

  ngOnInit(): void {
    if (this.authService.userData?.museumId != null) {

      this.artWorksData$ = this.artWorkService.getAllArtWorksFromMuseum(this.authService.userData?.museumId);
      this.categoriesData$ = this.categoryService.getAllCategoriesFromMuseum(this.authService.userData?.museumId);

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

  public loadImages() {
    console.log("teste")
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
