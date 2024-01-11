import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from './event';
import { Observable, catchError, map, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getAllEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges({ idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(element => {
          return {
            id: element.id,
            title: element['title'],
            description: element['description'],
            pathToImage: element['pathToImage'],
          }
        })
      })
    );
  }

  getImageUrl(imagePath: string): Observable<string | null> {
    const storageRef = this.storage.ref(imagePath);

    return storageRef.getDownloadURL().pipe(
      map(url => url),
      catchError(error => {
        console.error('Erro ao obter URL da imagem:', error);
        return of(null);
      })
    );
  }

  downloadFile(fileName: string): Observable<string> {
    const fileRef = this.storage.ref(`${fileName}`);
    return fileRef.getDownloadURL();
  }
}
