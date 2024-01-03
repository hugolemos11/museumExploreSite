import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public myEvent: EventEmitter<any>;
  constructor() {
    this.myEvent = new EventEmitter<any>();
  }

}
