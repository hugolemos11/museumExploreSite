import { Component, OnInit } from '@angular/core';
import { EventService } from '../../event.service';
import { Event } from '../event';
import { EventsService } from '../events.service';
import { data } from 'jquery';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent implements OnInit {

  constructor(private service: EventsService) { }

  eventsList: Event[] = [];
  eventImages: string[] = [];
  isMobileLayout = true;

  ngOnInit(): void {
    try {

      this.service.getAllEvents().subscribe(data => {

        this.eventsList = data;
        this.loadImages();
      });

      window.onresize = () => this.isMobileLayout = window.innerWidth > 767;

    } catch (error) {
      console.log(error);
    }
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
