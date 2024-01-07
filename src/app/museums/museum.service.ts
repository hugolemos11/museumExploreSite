import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Museum } from './museum';

@Injectable({
  providedIn: 'root'
})
export class MuseumService {

  constructor(private firestore: AngularFirestore) { }

  getAllMuseums(): Observable<Museum[]> {
    return this.firestore.collection<Museum>('museums').valueChanges({ idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(element => {
          return {
            id: element.id,
            name: element['name'],
            nameSearch: element['nameSearch'],
            description: element['description'],
            rate: element['rate'],
            ticketsNumber: element['ticketsNumber'],
            visits: element['visits'],
            latitude: element['latitude'],
            longitude: element['longitude'],
            pathToImage: element['pathToImage'],
          }
        })
      })
    );
  }
}
