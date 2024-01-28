import { Component, OnInit } from '@angular/core';
import { EventService } from '../../event.service';
import { AuthService } from '../auth.service';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Museum } from '../../museums/museum';
import { MuseumService } from '../../museums/museum.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  responsiveOptions: any = [];

  museumsData$: Observable<Array<Museum>> = new Observable<Array<Museum>>;

  constructor(private museumService: MuseumService) {
    this.responsiveOptions = [
      {
        breakpoint: '1420px',
        numVisible: 4,
        numScroll: 2
      },
      {
        breakpoint: '1080px',
        numVisible: 3,
        numScroll: 2
      },
      {
        breakpoint: '750px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '525px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.museumsData$ = this.museumService.getAllMuseums().pipe(
      switchMap((museumsData: Museum[]) => {
        if (museumsData != null) {
          const imageObservables = museumsData.map((museum: Museum) =>
            this.museumService.downloadFile(museum.pathToImage)
          );

          return forkJoin(imageObservables).pipe(
            map((imageArrays: string[]) => {
              museumsData.forEach((museum, index) => {
                museum.image = imageArrays[index];
                console.log(museum.image)
              });
              return museumsData;
            })
          );
        } else {
          console.log('Museums data is empty!');
          return [];
        }
      })
    );
  }
}
