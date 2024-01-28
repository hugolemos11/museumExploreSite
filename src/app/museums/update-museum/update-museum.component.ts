import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MuseumService } from '../museum.service';
import { Museum } from '../museum';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-update-museum',
  templateUrl: './update-museum.component.html',
  styleUrls: ['./update-museum.component.css']
})
export class UpdateMuseumComponent implements OnInit, AfterViewInit {

  museumData$: Observable<Museum> = new Observable<Museum>();
  museumData?: Museum;
  museumImage: string = '';

  locationValue: string = '';

  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  mapContainer: HTMLElement | null = null;
  currentPosition = { lngX: -118.274861, latY: 36.598999 }
  marker?: mapboxgl.Marker;

  constructor(private authService: AuthService, private museumService: MuseumService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.mapContainer = document.getElementById('map');
    this.initializeMap();
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
    const file = event.target.files[0];

    if (file) {
      const maxSizeInBytes = 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
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

      reader.readAsDataURL(file);
    } else {
      this.loadImage();
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
          this.marker.setLngLat(e.lngLat).addTo(this.map);

          const locationInput = document.getElementById("location") as HTMLInputElement;
          if (locationInput) {
            console.log(e.lngLat)
            locationInput.value = `${e.lngLat.lat}, ${e.lngLat.lng}`;
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

        // Add a new marker
        this.marker = new mapboxgl.Marker();
        this.marker.setLngLat(<mapboxgl.LngLatLike>[...coordinates]).addTo(this.map);

        // Set map center to the coordinates
        this.map.setCenter(<mapboxgl.LngLatLike>[...coordinates]);
        new mapboxgl.Marker()
          .setLngLat(<mapboxgl.LngLatLike>[...coordinates])
          .addTo(this.map);
      } else {
        console.error('Invalid coordinates format');
      }
    }
  }
}