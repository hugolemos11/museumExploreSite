import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ArtworkService } from '../artwork.service';

@Component({
  selector: 'app-delete-artwork',
  templateUrl: './delete-artwork.component.html',
  styleUrl: './delete-artwork.component.css'
})
export class DeleteArtworkComponent {

  @Input() artWorkId: string

  @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef;

  constructor(private artWorkService: ArtworkService) {
    this.artWorkId = ''
  }

  loadArtWorkId(artWorkId: string) {
    if (artWorkId !== undefined) {
      this.artWorkId = artWorkId;
    } else {
      console.log('Art Work ID is undefined. Error.');
    }
  }

  deleteArtWork() {
    try {
      //call service
      this.artWorkService.deleteArtWork(this.artWorkId);
      this.closeDeleteModal.nativeElement.click();
    } catch (error) {
      console.error(error);
    }
  }
}
