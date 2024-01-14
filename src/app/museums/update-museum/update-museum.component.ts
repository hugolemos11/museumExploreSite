import { Component, OnInit } from '@angular/core';
import { MuseumService } from '../museum.service';
import { Museum } from '../museum';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-update-museum',
  templateUrl: './update-museum.component.html',
  styleUrl: './update-museum.component.css'
})
export class UpdateMuseumComponent implements OnInit {

  museumData!: Museum
  museumImage!: String

  constructor(private authService: AuthService, private museumService: MuseumService) { }

  ngOnInit(): void {
    this.museumService.getMuseumById(this.authService.userData?.museumId).subscribe(data => {
      this.museumData = data;
      this.loadImage();
      console.log(this.museumImage)
    })
  }

  public loadImage() {
    this.museumService.downloadFile(this.museumData.pathToImage);
  }
}
