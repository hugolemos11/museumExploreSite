import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MuseumService } from '../museum.service';
import { Museum } from '../museum';
import { AuthService } from '../../auth/auth.service';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { TicketType } from '../../tickets/ticket';
import { TicketService } from '../../tickets/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-museum',
  templateUrl: './update-museum.component.html',
  styleUrls: ['./update-museum.component.css']
})
export class UpdateMuseumComponent implements OnInit, AfterViewInit {

  responsiveOptions: any = [];

  museumData$: Observable<Museum> = new Observable<Museum>();
  museumData?: Museum;
  museumImage: string = '';

  file: File = new File([], '', { type: 'text/plain' });
  museumForm: FormGroup;

  ticketTypesData$: Observable<Array<TicketType>> = new Observable<Array<TicketType>>();

  locationValue: string = '';

  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  mapContainer: HTMLElement | null = null;
  currentPosition = { lngX: -118.274861, latY: 36.598999 }
  marker?: mapboxgl.Marker;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private museumService: MuseumService, private ticketService: TicketService) {
    this.museumForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      //phoneNumber: ['', [Validators.required]],
      location: ['', [Validators.required]],
    })
    this.responsiveOptions = [
      {
        breakpoint: '1420px',
        numVisible: 4,
        numScroll: 1
      },
      {
        breakpoint: '1080px',
        numVisible: 3,
        numScroll: 2
      },
      {
        breakpoint: '750px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '525px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.mapContainer = document.getElementById('map');
    this.initializeMap();
  }

  updateMuseum() {
    console.log(this.museumForm.valid)
    if (this.museumForm.valid) {
      try {
        // Update museumData.location based on locationValue
        console.log(this.locationValue)
        const coordinates = this.locationValue.split(',').map(Number);

        console.log(coordinates)
        if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
          this.museumData!.location = {
            latitude: coordinates[1],
            longitude: coordinates[0],
          };
        }

        this.museumService.updateMuseum(this.museumData!).then(() => {
          if (this.file.name !== '') {
            this.museumService.uploadFile(this.museumData!.pathToImage, this.file);
          }
        });

      } catch (error) {
        console.error(error);
      }

    } else {
      // Handle invalid form
      this.museumForm.markAllAsTouched();
      console.error('Form is invalid');
    }

  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.museumForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.museumForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON);
      if (userData.museumId != null) {
        this.museumData$ = this.museumService.getMuseumById(userData.museumId);
        this.museumData$.subscribe(museumData => {
          if (museumData != null) {
            this.museumData = museumData;
            this.loadImage();
          } else {
            console.log('Museum data is empty!');
          }
        });
        this.ticketTypesData$ = this.ticketService.getAllTicketsTypes(userData.museumId).pipe(
          switchMap((ticketTypesData: TicketType[]) => {
            if (ticketTypesData != null) {
              const imageObservables = ticketTypesData.map((ticketType: TicketType) =>
                this.ticketService.downloadFile(ticketType.pathToImage)
              );

              return forkJoin(imageObservables).pipe(
                map((imageArrays: string[]) => {
                  ticketTypesData.forEach((ticketType, index) => {
                    ticketType.image = imageArrays[index];
                  });
                  return ticketTypesData;
                })
              );
            } else {
              console.log('Ticket Types data is empty!');
              return [];
            }
          })
        );
      } else {
        console.log('UserData museumId is null!');
      }
    }
  }

  loadImage() {
    const imageObservable = this.museumService.downloadFile(this.museumData!.pathToImage);
    imageObservable.subscribe(
      image => {
        this.museumImage = image;
      },
      error => {
        console.error(error);
        this.museumImage = '../../assets/imgs/museu1.jpg';
      }
    );
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
        this.museumImage = e.target?.result as string;
      };

      reader.readAsDataURL(this.file);
    } else {
      this.loadImage();
    }
  }

  async initializeMap() {
    if (this.map === undefined) {
      // Use a while loop to wait until this.userData is not null
      while (!this.museumData) {
        // Wait for a short duration before checking again
        await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
      }
      console.log(`Location: ${this.museumData?.location.longitude}, ${this.museumData?.location.latitude}`)

      // give a value to locationValue to present on the input
      this.locationValue = `${this.museumData.location.longitude}, ${this.museumData.location.latitude}`;

      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: this.mapContainer!,
        style: this.style,
        zoom: 13,
        center: [this.museumData?.location.longitude, this.museumData?.location.latitude],
      });

      // Add a new marker
      this.marker = new mapboxgl.Marker();
      this.marker.setLngLat([this.museumData?.location.longitude, this.museumData?.location.latitude]).addTo(this.map);

      this.map.on('load', () => {
        this.map?.resize();
      })

      // Add a marker on map click
      this.map.on('click', (e) => {
        if (this.map) {
          // Remove the previous marker
          if (this.marker) {
            this.marker.remove();
          }

          // Add a new marker
          this.marker = new mapboxgl.Marker();
          this.marker.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(this.map);

          const locationInput = document.getElementById("location") as HTMLInputElement;
          if (locationInput) {
            //need to update the locationValue here, because to update the value with [(NgModel)] the user needs to insert a value in the input
            this.locationValue = `${e.lngLat.lng}, ${e.lngLat.lat}`;
            locationInput.value = this.locationValue;

          }
        }
      });
    }
  }

  onLocationBlur() {
    // Use this.locationValue to update the map coordinates
    console.log('Input focused. Location value:', this.locationValue);

    // For example, you can set the map center to the coordinates extracted from the input value
    if (this.map && this.locationValue) {
      const coordinates = this.locationValue.split(',').map(Number); // Assuming input value is in the format "latitude,longitude"

      if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        // Remove the previous marker
        if (this.marker) {
          this.marker.remove();
        }

        const lngLat = new mapboxgl.LngLat(coordinates[0], coordinates[1])

        // Set map center to the coordinates
        this.map.setCenter(lngLat);
        // Add a new marker
        this.marker = new mapboxgl.Marker();
        //this.marker.setLngLat(e.lngLat).addTo(this.map);
        this.marker.setLngLat(lngLat).addTo(this.map);


      } else {
        console.error('Invalid coordinates format');
      }
    }
  }
}