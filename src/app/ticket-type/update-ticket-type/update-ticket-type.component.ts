import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketType } from '../ticket-type';
import { TicketTypeService } from '../ticket-type.service';
import { DeleteTicketTypeComponent } from '../delete-ticket-type/delete-ticket-type.component';

@Component({
  selector: 'app-update-ticket-type',
  templateUrl: './update-ticket-type.component.html',
  styleUrl: './update-ticket-type.component.css'
})
export class UpdateTicketTypeComponent {
  @Input() ticketType: TicketType;
  ticketTypeImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  updateTicketTypeForm: FormGroup;

  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  @ViewChild(DeleteTicketTypeComponent) deleteComponent!: DeleteTicketTypeComponent;

  constructor(private formBuilder: FormBuilder, private ticketService: TicketTypeService) {
    this.updateTicketTypeForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.ticketType = {
      id: '',
      museumId: '',
      type: '',
      price: 0,
      description: '',
      pathToImage: '',
    };
  }

  updateTicketType() {
    if (this.updateTicketTypeForm.valid) {
      try {
        //call service
        this.ticketService.updateTicketType(this.ticketType).then(() => {
          this.closeUpdateModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }

    } else {
      // Handle invalid form
      this.updateTicketTypeForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.updateTicketTypeForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.updateTicketTypeForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadTicketType(ticketTypeId: string) {
    if (ticketTypeId !== undefined) {
      this.ticketService.getTicketTypeById(ticketTypeId).subscribe((data) => {
        if (data?.id !== '') {
          this.ticketType = {
            id: ticketTypeId,
            museumId: data.museumId,
            type: data.type,
            price: data.price,
            description: data.description,
            pathToImage: data.pathToImage,
          };
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching coder data:', error); // Log any error from getCoderById
      });
    } else {
      console.log('Art Work ID is undefined. Error.');
    }
  }

  setEventId(event: any, eventId: string) {
    if (eventId !== undefined) {
      //this.deleteComponent.loadEventId(eventId)
    } else {
      console.log("erro");
    }
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    this.file = event.target.files[0];

    if (this.file) {
      const maxSizeInBytes = 1024 * 1024; // 1 MB
      if (this.file.size > maxSizeInBytes) {
        alert('File size exceeds the limit (1 MB). Please choose a smaller file.');
        // Optionally, you can reset the input value to clear the selected file
        event.target.value = '';
        return;
      }

      // Use FileReader to read the selected file and update the image source
      const reader = new FileReader();

      reader.onload = (e) => {
        this.ticketTypeImage = e.target?.result as string;
      };

      reader.readAsDataURL(this.file);
    } else {
      this.loadImage();
    }
  }

  loadImage() {
    const imageObservable = this.ticketService.downloadFile(this.ticketType.pathToImage);
    imageObservable.subscribe(
      image => {
        this.ticketTypeImage = image;
      },
      error => {
        console.error(error);
        this.ticketTypeImage = './assets/imgs/defaultImage.png';
      }
    );
  }
}
