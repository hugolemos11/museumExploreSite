import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Museumimage } from '../museumimage';
import { MuseumService } from '../museum.service';
import { Observable, switchMap, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-addimages-museum',
  templateUrl: './addimages-museum.component.html',
  styleUrl: './addimages-museum.component.css'
})
export class AddimagesMuseumComponent {
  @Input() museumId: string;
  museumImagesData$: Observable<Array<Museumimage>> = new Observable<Array<Museumimage>>;
  tempMuseumImagesFiles: File[] = [];
  tempMuseumImagePreviews: string[] = [];
  currentImageIndex: number = 0;
  numberOfImages: number = 0;

  @ViewChild('closeImagesModal') closeImagesModal!: ElementRef;

  constructor(private museumService: MuseumService) {
    this.museumId = '';
  }

  loadMuseumId(museumId: string) {
    if (museumId !== undefined) {
      this.museumId = museumId;
      this.tempMuseumImagesFiles = [];
      this.tempMuseumImagePreviews = [];
      this.currentImageIndex = 0;
      this.numberOfImages = 0;
      this.loadImages();
    } else {
      console.log('Museum ID is undefined. Error.');
    }
  }

  loadImages() {
    this.museumImagesData$ = this.museumService.getOtherImages(this.museumId).pipe(
      switchMap((museumImagesData: Museumimage[]) => {
        if (museumImagesData != null) {
          const imageObservables = museumImagesData.map((museumImageData: Museumimage) =>
            this.museumService.downloadFile(museumImageData.pathToImage)
          );

          return forkJoin(imageObservables).pipe(
            map((imageArrays: string[]) => {
              museumImagesData.forEach((museumImageData, index) => {
                museumImageData.image = imageArrays[index];
              });
              return museumImagesData;
            })
          );
        } else {
          console.log('Museum Images data is empty!');
          return [];
        }
      })
    );
    this.museumImagesData$.subscribe((museumImagesData) => {
      // Set the current image index to the last index
      this.currentImageIndex = museumImagesData.length > 0 ? museumImagesData.length - 1 : 0;
      this.numberOfImages = museumImagesData.length > 0 ? museumImagesData.length : 0
    })

  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.tempMuseumImagePreviews = []
    this.tempMuseumImagesFiles = []

    // Iterate through selected files and add them to the temporary array
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      this.tempMuseumImagesFiles.push(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempMuseumImagePreviews.push(e.target.result);
        console.log(this.tempMuseumImagePreviews);
      };
      reader.readAsDataURL(file);
    }
  }

  saveMuseumImages() {
    // Iterate through temporary array and upload files to Firebase
    for (let i = 0; i < this.tempMuseumImagesFiles.length; i++) {
      const file: File = this.tempMuseumImagesFiles[i];

      // Create an object with the structure expected by your service
      const museumImage: { id: string; museumId: string; pathToImage: string; image: string } = {
        id: '',
        museumId: this.museumId,
        pathToImage: '',
        image: '',
      };

      try {
        //call service
        this.museumService.createMuseumImage(museumImage).then((result) => {
          const fileNameSplit = file.name.split('.');
          museumImage.id = result.id;
          museumImage.pathToImage = 'museumImages/' + museumImage.id + '.' + fileNameSplit[fileNameSplit.length - 1];
          this.museumService.uploadFile(museumImage.pathToImage, file);
          this.museumService.updateMuseumImage(museumImage);
          this.closeImagesModal.nativeElement.click();
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  deleteMuseumImage(museumImageId: string, pathToImage: string) {
    try {
      //call service
      this.museumService.deleteMuseumImage(museumImageId, pathToImage).then(() => {
        console.log('Museum Image deleted successfully.');
        // Update the current image index
        this.currentImageIndex = Math.max(0, this.currentImageIndex - 1);

        // Decrement the count of images to be deleted
        this.numberOfImages--;

        // Check if all images are deleted
        if (this.numberOfImages === 0) {
          // Dismiss the modal when all images are deleted
          this.closeImagesModal.nativeElement.click();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
