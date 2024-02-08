import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketType } from '../ticket-type';
import { TicketTypeService } from '../ticket-type.service';

@Component({
  selector: 'app-create-ticket-type',
  templateUrl: './create-ticket-type.component.html',
  styleUrl: './create-ticket-type.component.css'
})
export class CreateTicketTypeComponent {
  @Input() museumId: string;
  ticketType: TicketType;
  ticketTypeImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  createTicketTypeForm: FormGroup;

  @ViewChild('closeCreateModal') closeCreateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private ticketService: TicketTypeService) {
    this.museumId = '';
    this.createTicketTypeForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
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

  createTicketType() {
    if (this.createTicketTypeForm.valid) {
      try {
        this.ticketService.createTicketType(this.ticketType).then(async (result) => {
          const fileNameSplit = this.file.name.split('.');
          this.ticketType.id = result.id;
          this.ticketType.museumId = this.museumId;
          this.ticketType.pathToImage = 'eventsImages/' + this.ticketType.id + '.' + fileNameSplit[fileNameSplit.length - 1];
          // Wait for the file upload to complete
          await this.ticketService.uploadFile(this.ticketType.pathToImage, this.file);
          this.ticketService.updateTicketType(this.ticketType);
          // Update successful, close the modal
          this.closeCreateModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle invalid form
      this.createTicketTypeForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.createTicketTypeForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.createTicketTypeForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  loadMuseumId(museumId: string) {
    if (museumId !== undefined) {
      this.museumId = museumId;
    } else {
      console.log('Museum ID is undefined. Error.');
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
    }
  }
}
