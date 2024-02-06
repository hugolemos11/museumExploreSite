import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../event';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  @Input() museumId: string;
  event: Event;
  eventImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  createEventForm: FormGroup;

  @ViewChild('closeCreateModal') closeCreateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private eventService: EventsService) {
    this.museumId = '';
    this.createEventForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      finishDate: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
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

  createEvent() {
    if (this.createEventForm.valid) {
      if (this.isFinishDateValid()) {
        try {
          //call service
          this.event.startDate = new Date(this.event.startDate)
          this.event.finishDate = new Date(this.event.finishDate)
          this.eventService.createEvent(this.event).then(async (result) => {
            const fileNameSplit = this.file.name.split('.');
            this.event.id = result.id;
            this.event.museumId = this.museumId;
            this.event.pathToImage = 'eventsImages/' + this.event.id + '.' + fileNameSplit[fileNameSplit.length - 1];
            // Wait for the file upload to complete
            await this.eventService.uploadFile(this.event.pathToImage, this.file);
            this.eventService.updateEvent(this.event);
            // Update successful, close the modal
            this.closeCreateModal.nativeElement.click();
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      // Handle invalid form
      this.createEventForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  isFinishDateValid(): boolean {
    const startDateControl = this.createEventForm.get('startDate');
    const finishDateControl = this.createEventForm.get('finishDate');


    if (finishDateControl && startDateControl) {
      const startDate = new Date(startDateControl.value);
      const finishDate = new Date(finishDateControl.value);

      return startDate <= finishDate;
    }

    return false;
  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.createEventForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.createEventForm.get(fieldName);
    if (control != null) {
      isInvalid = control.invalid && (control.touched || control.dirty);

      if (fieldName === 'finishDate' && control.value && this.createEventForm.get('startDate')?.value) {
        const finishDate = new Date(control.value);
        const startDate = new Date(this.createEventForm.get('startDate')?.value);

        if (finishDate < startDate) {
          isInvalid = true;
        }
      }
    }

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
        this.eventImage = e.target?.result as string;
      };

      reader.readAsDataURL(this.file);
    }
  }
}
