import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TicketTypeService } from '../ticket-type.service';

@Component({
  selector: 'app-delete-ticket-type',
  templateUrl: './delete-ticket-type.component.html',
  styleUrl: './delete-ticket-type.component.css'
})
export class DeleteTicketTypeComponent {
  @Input() ticketTypeId: string

  @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef;

  constructor(private ticketTypeService: TicketTypeService) {
    this.ticketTypeId = ''
  }

  loadTicketTypeId(eventId: string) {
    if (eventId !== undefined) {
      this.ticketTypeId = eventId;
    } else {
      console.log('Ticket Type ID is undefined. Error.');
    }
  }

  deleteTicketType() {
    try {
      //call service
      this.ticketTypeService.deleteTicketType(this.ticketTypeId);
      this.closeDeleteModal.nativeElement.click();
    } catch (error) {
      console.error(error);
    }
  }
}
