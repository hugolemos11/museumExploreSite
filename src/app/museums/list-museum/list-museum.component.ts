import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { Museum } from '../museum';
import { MuseumService } from '../museum.service';

@Component({
  selector: 'app-list-museum',
  templateUrl: './list-museum.component.html',
  styleUrl: './list-museum.component.css'
})
export class ListMuseumComponent implements OnInit {

  constructor(private service: MuseumService) { }

  museumList: Museum[] = [];

  ngOnInit(): void {
    try {
      this.service.getAllMuseums().subscribe(data => {
        this.museumList = data;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
