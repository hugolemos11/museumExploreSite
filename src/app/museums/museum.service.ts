import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Museum } from './museum';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class MuseumService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

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

  getMuseumById(id?: string): Observable<Museum> {
    return this.firestore.collection<Museum>('museums').doc<Museum>(id).valueChanges().pipe(
      map((data: any) => {
        console.log(`teste ${data}`)
        return {
          id: data['id'],
          name: data['name'],
          description: data['description'],
          rate: data['rate'],
          ticketsNumber: data['ticketsNumber'],
          visits: data['visits'],
          latitude: data['latitude'],
          longitude: data['longitude'],
          pathToImage: data['pathToImage'],
        };
      })
    );
  }

  downloadFile(fileName: string): Observable<string> {
    const fileRef = this.storage.ref(`${fileName}`);
    return fileRef.getDownloadURL();
  }
}
