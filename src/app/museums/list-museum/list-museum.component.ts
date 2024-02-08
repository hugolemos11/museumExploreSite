import { AfterViewInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Museum } from '../museum';
import { MuseumService } from '../museum.service';
import { Observable, switchMap, forkJoin, map } from 'rxjs';
import { CreateMuseumComponent } from '../create-museum/create-museum.component';

@Component({
  selector: 'app-list-museum',
  templateUrl: './list-museum.component.html',
  styleUrl: './list-museum.component.css'
})
export class ListMuseumComponent implements OnInit {

  museumsData$: Observable<Array<Museum>> = new Observable<Array<Museum>>;
  searchTerm: string = '';

  @ViewChild(CreateMuseumComponent) createComponent!: CreateMuseumComponent;

  constructor(private museumService: MuseumService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  reloadData() {
    this.fetchData();
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON)
      if (userData.admin == true && userData.museumId == null) {
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
                  });

                  // Filter museums based on the searchValue
                  if (this.searchTerm != '') {
                    museumsData = museumsData.filter(museum => museum.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
                  }

                  return museumsData;
                })
              );
            } else {
              console.log('Museums data is empty!');
              return [];
            }
          })
        );
      } else {
        console.log('User is not a global Admin!');
      }
    }
  }

  /*setMuseumId(event: any) {
    if (this.museumId !== undefined) {
      this.createComponent.loadMuseumId(this.museumId);
    } else {
      console.log("erro");
    }
  }*/
}
