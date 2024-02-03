import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ArtworkService } from '../artwork.service';
import { Observable, catchError, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-addimages-artwork',
  templateUrl: './addimages-artwork.component.html',
  styleUrl: './addimages-artwork.component.css'
})
export class AddimagesArtworkComponent {
  @Input() artWorkId: string;
  artWorkImages: string[] = [];
  tempArtWorkImages: string[] = [];
  tempArtWorkImagesFiles: File[] = [];
  tempArtWorkImagePreviews: string[] = [];
  file: File = new File([], '', { type: 'text/plain' });
  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef;

  constructor(private artWorkService: ArtworkService) {
    this.artWorkId = '';
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
    this.artWorkImages = []; // Clear the existing images
    console.log("ola")
    this.artWorkService.getOtherImages(this.artWorkId).pipe(
      switchMap(fileNames => {
        const downloadObservables: Observable<string>[] = fileNames.map(fileName =>
          this.artWorkService.downloadFile(fileName).pipe(
            catchError(error => {
              console.error(`Error downloading file ${fileName}: ${error}`);
              return of('./assets/imgs/defaultImage.png'); // Provide a default image on error
            })
          )
        );
        return forkJoin(downloadObservables);
      })
    ).subscribe(
      downloadedImages => {
        this.artWorkImages = downloadedImages;
        this.tempArtWorkImages = this.artWorkImages;
      },
      error => {
        console.error(error);
        // Handle the error if needed
      }
    );
  }

  onFileChange(event: any) {
    // reset the images
    this.tempArtWorkImages = [];
    if (this.tempArtWorkImages != this.artWorkImages) {
      this.tempArtWorkImages = this.artWorkImages;
      console.log(this.tempArtWorkImages)
    }


    const files: FileList = event.target.files;

    // Iterate through selected files and add them to the temporary array
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      this.tempArtWorkImagesFiles.push(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempArtWorkImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  /*saveArtWorkImages() {
    // Iterate through temporary array and upload files to Firebase
    for (let i = 0; i < this.tempArtWorkImages.length; i++) {
      const file: File = this.tempArtWorkImagesFiles[i];

      const fileNameSplit = this.file.name.split('.');
      const pathToImage = 'artWorksImages/' + this.artWorkId + '.' + fileNameSplit[fileNameSplit.length - 1];
      this.artWorkService.uploadFile(pathToImage, file);
      this.artWorkService.downloadFile(pathToImage).subscribe(
        imageUrl => {
          this.artWorkImages.push(imageUrl);
        },
        error => {
          console.error(`Error uploading file ${file.name}: ${error}`);
        }
      );
    }

    // Clear the temporary array
    this.tempArtWorkImages = [];
  }*/
}
