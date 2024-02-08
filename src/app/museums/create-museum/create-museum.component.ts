import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Museum } from '../museum';
import { MuseumService } from '../museum.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-museum',
  templateUrl: './create-museum.component.html',
  styleUrl: './create-museum.component.css'
})
export class CreateMuseumComponent {
  museum: Museum;
  museumImage: string = './assets/imgs/defaultImage.png';
  file: File = new File([], '', { type: 'text/plain' });
  createMuseumForm: FormGroup;

  locationValue: string = '';

  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  mapContainer: HTMLElement | null = null;
  currentPosition = { lngX: -8.29619, latY: 41.44443 }
  marker?: mapboxgl.Marker;

  @ViewChild('closeCreateModal') closeCreateModal!: ElementRef;

  constructor(private formBuilder: FormBuilder, private museumService: MuseumService, private authService: AuthService) {
    this.createMuseumForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
    this.museum = {
      id: '',
      name: '',
      description: '',
      location: {
        latitude: 0,
        longitude: 0,
      },
      pathToImage: '',
    };
  }

  ngAfterViewInit(): void {
    this.mapContainer = document.getElementById('map');
    this.initializeMap();
  }

  createMuseum() {
    if (this.createMuseumForm.valid) {
      try {
        // Update museumData.location based on locationValue
        const coordinates = this.locationValue.split(',').map(Number);

        console.log(coordinates)
        if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
          this.museum.location = {
            latitude: coordinates[1],
            longitude: coordinates[0],
          };
        }
        this.museumService.createMuseum(this.museum).then(async (result) => {
          const fileNameSplit = this.file.name.split('.');
          this.museum.id = result.id;
          this.museum.pathToImage = 'eventsImages/' + this.museum.id + '.' + fileNameSplit[fileNameSplit.length - 1];
          // Wait for the file upload to complete
          await this.museumService.uploadFile(this.museum.pathToImage, this.file);
          this.museumService.updateMuseum(this.museum);

          // Create User
          console.log(this.museum.name)
          const museumName = this.museum.name.replace(/\s/g, "").toLowerCase();
          const email = museumName + '@museumexplore.com';
          const password = '123' + museumName[0].toUpperCase() + museumName.slice(1) + '*';
          console.log(email)
          console.log(password)
          this.authService.SignUp(email, password, this.museum.name)
          // Update successful, close the modal
          this.closeCreateModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle invalid form
      this.createMuseumForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }

  //verify if input was touched
  isFieldTouched(fieldName: string) {
    let isTouched: boolean = true
    const control = this.createMuseumForm.get(fieldName);
    if (control != null)
      isTouched = control.touched;
    return isTouched;
  }

  //verify if input value is valid 
  isFieldInvalid(fieldName: string) {
    let isInvalid: boolean = true;
    const control = this.createMuseumForm.get(fieldName);
    if (control != null)
      isInvalid = control.invalid && (control.touched || control.dirty);
    return isInvalid;
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
    }
  }

  initializeMap() {
    if (this.map === undefined) {
      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: this.mapContainer!,
        style: this.style,
        zoom: 13,
        center: [this.currentPosition.lngX, this.currentPosition.latY],
      });

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
