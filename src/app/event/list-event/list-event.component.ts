import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Event } from '../event';
import { EventsService } from '../events.service';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { UpdateEventComponent } from '../update-event/update-event.component';
import { CreateEventComponent } from '../create-event/create-event.component';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent implements OnInit {

  eventsData$: Observable<Array<Event>> = new Observable<Array<Event>>;
  eventImages: string[] = [];

  event: Event;
  museumId: string = '';

  @ViewChild(CreateEventComponent) createComponent!: CreateEventComponent;
  @ViewChild(UpdateEventComponent) updateComponent!: UpdateEventComponent;

  constructor(private eventService: EventsService) {
    this.event = {
      id: '',
      title: '',
      description: '',
      museumId: '',
      startDate: new Date(),
      finishDate: new Date(),
      pathToImage: '',
    };
  }

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON)
      if (userData.museumId != null) {
        this.museumId = userData.museumId;
        this.eventsData$ = this.eventService.getAllEventsFromMuseum(userData.museumId).pipe(
          switchMap((eventsData: Event[]) => {
            if (eventsData != null) {
              const imageObservables = eventsData.map((event: Event) =>
                this.eventService.downloadFile(event.pathToImage)
              );

              return forkJoin(imageObservables).pipe(
                map((imageArrays: string[]) => {
                  eventsData.forEach((event, index) => {
                    event.image = imageArrays[index];
                  });

                  return eventsData;
                })
              );
            } else {
              console.log('Events data is empty!');
              return [];
            }
          })
        );
      } else {
        console.log('UserData museumId is null!');
      }
    }
  }

  getGridClasses(eventsList: Event[] | null): string {
    const length = eventsList?.length || 0;

    if (length === 1) {
      return 'col-12 mb-3';
    } else if (length === 2) {
      return 'col-md-6 mb-3';
    } else {
      return 'col-md-6 col-lg-4 mb-3';
    }
  }

  setMuseumId(event: any) {
    if (this.museumId !== undefined) {
      this.createComponent.loadMuseumId(this.museumId);
    } else {
      console.log("erro");
    }
  }

  setEvent(event: any, eventData: Event) {
    if (eventData && eventData.id !== undefined) {
      this.updateComponent.loadEvent(eventData.id);
    } else {
      console.log("erro");
    }
  }
}
