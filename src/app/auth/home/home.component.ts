import { Component, OnInit } from '@angular/core';
import { EventService } from '../../event.service';
import { AuthService } from '../auth.service';
import { Observable, map } from 'rxjs';
import { Museum } from '../../museums/museum';
import { MuseumService } from '../../museums/museum.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  museumsData$: Observable<Array<Museum>> = new Observable<Array<Museum>>;
  museumImages: string[] = [];

  constructor(private museumService: MuseumService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.museumsData$ = this.museumService.getAllMuseums();

    // Subscribe to the observables to get the data
    this.museumsData$.subscribe(museumsData => {
      if (museumsData != null) {
        // Update the --num-museums variable
        document.documentElement.style.setProperty('--num-museums', museumsData.length.toString());
        this.loadImages();
      } else {
        console.log('Museums data is empty!');
      }
    });
  }

  public loadImages() {
    this.museumsData$.pipe(
      map((museums: Museum[]) => {
        const museumsDatalength = museums.length
        museums.map((museum: Museum) => {
          const imageObservable = this.museumService.downloadFile(museum.pathToImage);
          imageObservable.subscribe(
            imageArray => {
              this.museumImages.push(imageArray);
            },
            error => {
              console.error(error);
              this.museumImages = Array(museumsDatalength).fill('../../assets/imgs/museu1.jpg');
            }
          )
        })
      }),
    ).subscribe();
  }
}
