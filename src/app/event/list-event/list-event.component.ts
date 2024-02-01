import { Component, HostListener, OnInit } from '@angular/core';
import { Event } from '../event';
import { EventsService } from '../events.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent implements OnInit {

  eventsList: Event[] = [];
  eventImages: string[] = [];
  isMobileLayout?: boolean;

  constructor(private service: EventsService) {
    this.isMobileLayout = window.innerWidth > 770;
  }

  ngOnInit(): void {
    try {
      this.service.getAllEvents().subscribe(data => {
        this.eventsList = data;
        this.loadImages();
      });
    } catch (error) {
      console.log(error);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobileLayout = window.innerWidth > 770;
  }

  getGridClasses(length: number): string {
    if (length === 1) {
      return 'col-12 mb-3';
    } else if (length === 2) {
      return 'col-md-6 mb-3';
    } else {
      return 'col-md-6 col-lg-4 mb-3';
    }
  }

  public loadImages() {
    const imageObservables = this.eventsList.map(event => {
      return this.service.downloadFile(event.pathToImage);
    });

    forkJoin(imageObservables).subscribe(
      imageArray => {
        this.eventImages = imageArray;
      },
      error => {
        console.error(error);
        this.eventImages = Array(this.eventsList.length).fill('../../assets/imgs/museu1.jpg');
      }
    );
  }

}
