import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-delete-event',
  templateUrl: './delete-event.component.html',
  styleUrl: './delete-event.component.css'
})
export class DeleteEventComponent {
  @Input() eventId: string

  @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef;

  constructor(private eventService: EventsService) {
    this.eventId = ''
  }

  loadEventId(eventId: string) {
    if (eventId !== undefined) {
      this.eventId = eventId;
    } else {
      console.log('Event ID is undefined. Error.');
    }
  }

  deleteEvent() {
    try {
      //call service
      this.eventService.deleteEvent(this.eventId);
      this.closeDeleteModal.nativeElement.click();
    } catch (error) {
      console.error(error);
    }
  }
}
