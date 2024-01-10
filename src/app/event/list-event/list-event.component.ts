import { Component } from '@angular/core';
import { EventService } from '../../event.service';
import { Event } from '../event';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent {

  constructor(private service: EventsService) { }

  eventsList: Event[] = [];
  imagemUri: string | null = null;

  ngOnInit(): void {
    try {
      this.service.getAllEvents().subscribe(data => {
        this.eventsList = data;
      });
    } catch (error) {
      console.log(error);
    }


  }

  /*loadImage(imagePath: string): void {
    this.service.getImageUrl(imagePath).subscribe(
      uri => {
        this.imagemUri = uri;
      },
      error => {
        console.error('Erro ao carregar a imagem:', error);
      }
    );
  }*/
}
