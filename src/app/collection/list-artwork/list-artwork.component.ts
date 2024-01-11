import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Artwork } from '../artwork';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-artwork',
  templateUrl: './list-artwork.component.html',
  styleUrl: './list-artwork.component.css'
})
export class ListArtworkComponent implements OnInit {

  constructor(private service: ArtworkService) { }

  artWorkList: Artwork[] = [];
  artworkImages: string[] = [];

  ngOnInit(): void {
    try {
      this.service.getAllArtWorks().subscribe(data => {
        this.artWorkList = data;
        this.loadImages();
      });
    } catch (error) {
      console.log(error);
    }
  }

  public loadImages() {
    const imageObservables = this.artWorkList.map(artwork => {
      return this.service.downloadFile(artwork.pathToImage);
    });

    forkJoin(imageObservables).subscribe(
      imageArray => {
        this.artworkImages = imageArray;
      },
      error => {
        console.error(error);
        this.artworkImages = Array(this.artWorkList.length).fill('../../assets/imgs/museu1.jpg');
      }
    );
  }
}
