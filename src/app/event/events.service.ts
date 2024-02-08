import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from './event';
import { Observable, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getAllEventsFromMuseum(museumId: string): Observable<Event[]> {
    return this.firestore.collection<Event>('events', ref =>
      ref.where('museumId', '==', museumId)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              title: element['title'],
              description: element['description'],
              museumId: element['museumId'],
              startDate: new Date(element.startDate.seconds * 1000),
              finishDate: new Date(element.finishDate.seconds * 1000),
              pathToImage: element['pathToImage'],
            }
          })
        }),
      );
  }

  getEventById(eventId: string): Observable<Event> {
    return this.firestore.collection<Event>('events').doc<Event>(eventId).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data() as any;
        const id = snapshot.payload.id;

        // Convert Timestamps to Date objects
        const startDate = new Date(data.startDate.seconds * 1000)
        const finishDate = new Date(data.finishDate.seconds * 1000)

        return {
          id: id,
          title: data['title'],
          description: data['description'],
          museumId: data['museumId'],
          startDate: startDate,
          finishDate: finishDate,
          pathToImage: data['pathToImage'],
        } as Event;
      })
    );
  }

  createEvent(event: Event): Promise<any> {
    var firestoreEvent: any = {
      'title': event.title,
      'description': event.description,
      'museumId': event.museumId,
      'startDate': event.startDate,
      'finishDate': event.finishDate,
      'pathToImage': event.pathToImage,
    };

    return this.firestore.collection<Event>('events').add(firestoreEvent);
  }

  updateEvent(event: Event): Promise<void> {
    var firestoreEvent: any = {
      'title': event.title,
      'description': event.description,
      'museumId': event.museumId,
      'startDate': event.startDate,
      'finishDate': event.finishDate,
      'pathToImage': event.pathToImage,
    };
    return this.firestore.collection<Event>('events').doc(event.id).update(firestoreEvent);
  }

  deleteEvent(eventId: string): Promise<void> {
    return this.firestore.collection<Event>('events').doc(eventId).delete();
  }

  downloadFile(fileName: string): Observable<string> {
    const fileRef = this.storage.ref(`${fileName}`);
    return fileRef.getDownloadURL();
  }

  uploadFile(fileName: string, file: File): Promise<void> {
    const filePath = `${fileName}`;
    const uploadTask = this.storage.upload(filePath, file);

    // Create a Promise to handle the completion of the upload task
    return new Promise<void>((resolve, reject) => {
      uploadTask.then(_ => {
        // The upload is complete
        resolve();
      }).catch(error => {
        // An error occurred during the upload
        console.error(error);
        reject(error);
      });
    });
  }
}
