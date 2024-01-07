import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Artwork } from '../artwork';

@Component({
  selector: 'app-list-artwork',
  templateUrl: './list-artwork.component.html',
  styleUrl: './list-artwork.component.css'
})
export class ListArtworkComponent implements OnInit {

  constructor(private service: ArtworkService) { }

  artWorkList: Artwork[] = [];

  ngOnInit(): void {
    try {
      this.service.getAllArtWorks().subscribe(data => {
        this.artWorkList = data;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
