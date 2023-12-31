import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Artwork } from './artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(private firestore: AngularFirestore) { }

  getAllArtWorks(): Observable<Artwork[]> {
    return this.firestore.collection<Artwork>('artWorks').valueChanges({ idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(element => {
          return {
            id: element.id,
            name: element['name'],
            artist: element['artist'],
            year: element['year'],
            category: element['category'],
            description: element['description'],
            museumId: element['museumId'],
            pathToImage: element['pathToImage'],
          }
        })
      })
    );
  }
}
