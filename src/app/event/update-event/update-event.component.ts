import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Event } from '../event';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteEventComponent } from '../delete-event/delete-event.component';
import { EventsService } from '../events.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.css'
})
export class UpdateEventComponent {
  @Input() event: Event;
  eventImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  updateEventForm: FormGroup;

  formattedStartDate: string = ''
  formattedFinishDate: string = ''

  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  @ViewChild(DeleteEventComponent) deleteComponent!: DeleteEventComponent;

  constructor(private formBuilder: FormBuilder, private eventService: EventsService, private datePipe: DatePipe) {
    this.updateEventForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      finishDate: ['', [Validators.required]],
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

  updateEvent() {
    if (this.updateEventForm.valid) {
      if (this.isFinishDateValid()) {
        try {
          //call service
          this.event.startDate = new Date(this.formattedStartDate)
          this.event.finishDate = new Date(this.formattedFinishDate)
          console.log(this.event)
          this.eventService.updateEvent(this.event).then(() => {
            if (this.file.name !== '') {
              this.eventService.uploadFile(this.event.pathToImage, this.file);
            }
            this.closeUpdateModal.nativeElement.click();
          });

        } catch (error) {
          console.error(error);
        }
      }

    } else {
      // Handle invalid form
      this.updateEventForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  isFinishDateValid(): boolean {
    const startDateControl = this.updateEventForm.get('startDate');
    const finishDateControl = this.updateEventForm.get('finishDate');


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
    const control = this.updateEventForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.updateEventForm.get(fieldName);
    if (control != null) {
      isInvalid = control.invalid && (control.touched || control.dirty);

      if (fieldName === 'finishDate' && control.value && this.updateEventForm.get('startDate')?.value) {
        const finishDate = new Date(control.value);
        const startDate = new Date(this.updateEventForm.get('startDate')?.value);

        if (finishDate < startDate) {
          isInvalid = true;
        }
      }
    }
    return isInvalid;
  }

  loadEvent(eventId: string) {
    if (eventId !== undefined) {
      this.eventService.getEventById(eventId).subscribe((data) => {
        if (data?.id !== '') {
          this.event = {
            id: eventId,
            title: data.title,
            description: data.description,
            museumId: data.museumId,
            startDate: data.startDate,
            finishDate: data.finishDate,
            pathToImage: data.pathToImage,
          };
          this.formattedStartDate = this.datePipe.transform(data.startDate, 'yyyy-MM-dd') || '';
          this.formattedFinishDate = this.datePipe.transform(data.finishDate, 'yyyy-MM-dd') || '';
          this.loadImage();
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching event data:', error);
      });
    } else {
      console.log('Event ID is undefined. Error.');
    }
  }

  setEventId(event: any, eventId: string) {
    if (eventId !== undefined) {
      this.deleteComponent.loadEventId(eventId)
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
        this.eventImage = e.target?.result as string;
      };

      reader.readAsDataURL(this.file);
    } else {
      this.loadImage();
    }
  }

  loadImage() {
    const imageObservable = this.eventService.downloadFile(this.event.pathToImage);
    imageObservable.subscribe(
      image => {
        this.eventImage = image;
      },
      error => {
        console.error(error);
        this.eventImage = './assets/imgs/defaultImage.png';
      }
    );
  }
}
