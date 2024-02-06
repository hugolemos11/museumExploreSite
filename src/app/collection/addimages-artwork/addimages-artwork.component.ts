import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ArtWorkImage } from '../artworkimage';

@Component({
  selector: 'app-addimages-artwork',
  templateUrl: './addimages-artwork.component.html',
  styleUrl: './addimages-artwork.component.css'
})
export class AddimagesArtworkComponent {
  @Input() artWorkId: string;
  artWorkImagesData$: Observable<Array<ArtWorkImage>> = new Observable<Array<ArtWorkImage>>;
  tempArtWorkImagesFiles: File[] = [];
  tempArtWorkImagePreviews: string[] = [];
  currentImageIndex: number = 0;

  @ViewChild('closeImagesModal') closeImagesModal!: ElementRef;

  constructor(private artWorkService: ArtworkService) {
    this.artWorkId = '';
    this.tempArtWorkImagePreviews = [];
    this.tempArtWorkImagesFiles = [];
  }

  loadArtWorkId(artWorkId: string) {
    if (artWorkId !== undefined) {
      this.artWorkId = artWorkId;
      this.loadImages();
    } else {
      console.log('Art Work ID is undefined. Error.');
    }
  }

  loadImages() {
    this.artWorkImagesData$ = this.artWorkService.getOtherImages(this.artWorkId).pipe(
      switchMap((artWorkImagesData: ArtWorkImage[]) => {
        if (artWorkImagesData != null) {
          const imageObservables = artWorkImagesData.map((artWorkImage: ArtWorkImage) =>
            this.artWorkService.downloadFile(artWorkImage.pathToImage)
          );

          return forkJoin(imageObservables).pipe(
            map((imageArrays: string[]) => {
              artWorkImagesData.forEach((artWorkImage, index) => {
                artWorkImage.image = imageArrays[index];
              });
              return artWorkImagesData;
            })
          );
        } else {
          console.log('Art Works Images data is empty!');
          return [];
        }
      })
    );
    this.artWorkImagesData$.subscribe((artWorkImagesData) => {
      // Set the current image index to the last index
      this.currentImageIndex = artWorkImagesData.length > 0 ? artWorkImagesData.length - 1 : 0;
    })

  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.tempArtWorkImagePreviews = []
    this.tempArtWorkImagesFiles = []

    // Iterate through selected files and add them to the temporary array
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      this.tempArtWorkImagesFiles.push(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempArtWorkImagePreviews.push(e.target.result);
        console.log(this.tempArtWorkImagePreviews);
      };
      reader.readAsDataURL(file);
    }
  }

  saveArtWorkImages() {
    // Iterate through temporary array and upload files to Firebase
    for (let i = 0; i < this.tempArtWorkImagesFiles.length; i++) {
      const file: File = this.tempArtWorkImagesFiles[i];

      // Create an object with the structure expected by your service
      const artWorkImage: { id: string; artWorkId: string; pathToImage: string; image: string } = {
        id: '',
        artWorkId: this.artWorkId,
        pathToImage: '',
        image: '',
      };

      try {
        //call service
        this.artWorkService.createArtWorkImage(artWorkImage).then((result) => {
          const fileNameSplit = file.name.split('.');
          artWorkImage.id = result.id;
          artWorkImage.pathToImage = 'artWorksImages/' + artWorkImage.id + '.' + fileNameSplit[fileNameSplit.length - 1];
          this.artWorkService.uploadFile(artWorkImage.pathToImage, file);
          this.artWorkService.updateArtWorkImage(artWorkImage);
          this.closeImagesModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  deleteArtWorkImage(artWorkImageId: string) {
    try {
      console.log(artWorkImageId)
      //call service
      this.artWorkService.deleteArtWorkImage(artWorkImageId).then(() => {
        console.log('ArtWorkImage deleted successfully.');
        // Update the current image index
        this.currentImageIndex = Math.max(0, this.currentImageIndex - 1);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
