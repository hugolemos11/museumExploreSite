import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Museum } from './museum';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Museumimage } from './museumimage';

@Injectable({
  providedIn: 'root'
})
export class MuseumService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getAllMuseums(): Observable<Museum[]> {
    return this.firestore.collection<Museum>('museums').valueChanges({ idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(element => {
          // Extract latitude and longitude from GeoPoint
          const geoPoint = element['location']; // Assuming 'location' is the field name in Firestore
          const latitude = geoPoint.latitude;
          const longitude = geoPoint.longitude;

          return {
            id: element.id,
            name: element['name'],
            nameSearch: element['nameSearch'],
            description: element['description'],
            location: { latitude: latitude, longitude: longitude },
            pathToImage: element['pathToImage'],
          };
        });
      })
    );
  }

  getMuseumById(id?: string): Observable<Museum> {
    return this.firestore.collection<Museum>('museums').doc<Museum>(id).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data() as Museum;
        const id = snapshot.payload.id;

        // Extract latitude and longitude from GeoPoint
        const geoPoint = data['location'];
        const latitude = geoPoint.latitude;
        const longitude = geoPoint.longitude;

        return {
          id: id,
          name: data['name'],
          description: data['description'],
          location: { latitude: latitude, longitude: longitude },
          pathToImage: data['pathToImage'],
        };
      })
    );
  }

  getMuseumIdByMuseumName(museumName: string): Observable<string | null> {
    return this.firestore.collection<Museum>('museums', ref =>
      ref.where('name', '==', museumName)
    ).snapshotChanges().pipe(
      map(museums => {
        const firstMuseum = museums[0];
        return firstMuseum ? firstMuseum.payload.doc.id : null;
      })
    );
  }

  createMuseum(museum: Museum): Promise<any> {
    console.log(museum)
    var firestoreMuseum: any = {
      id: museum,
      name: museum.name,
      description: museum.description,
      location: {
        latitude: museum.location.latitude,
        longitude: museum.location.longitude,
      },
      pathToImage: museum.pathToImage,
    };

    return this.firestore.collection<Museum>('museums').add(firestoreMuseum);
  }

  updateMuseum(museum: Museum): Promise<void> {

    var firestoreMuseum: any = {
      'id': museum.id,
      'name': museum.name,
      'description': museum.description,
      'location': {
        'latitude': museum.location.latitude,
        'longitude': museum.location.longitude,
      },
      'pathToImage': museum.pathToImage,
    };
    return this.firestore.collection<Museum>('museums').doc(museum.id).update(firestoreMuseum);
  }

  getOtherImages(museumId: string): Observable<Museumimage[]> {
    return this.firestore.collection<Museumimage[]>('imagesCollectionMuseum', ref => ref.where('museumId', '==', museumId))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              museumId: element['museumId'],
              pathToImage: element['pathToImage'],
            }
          })
        })
      );
  }

  createMuseumImage(museumImage: Museumimage): Promise<any> {
    var firestoreMuseumImage: any = {
      'museumId': museumImage.museumId,
      'pathToImage': museumImage.pathToImage,
    };

    return this.firestore.collection<Museumimage>('imagesCollectionMuseum').add(firestoreMuseumImage);
  }

  updateMuseumImage(museumImage: Museumimage): Promise<void> {
    var firestoreMuseumImage: any = {
      'museumId': museumImage.museumId,
      'pathToImage': museumImage.pathToImage,
    };
    return this.firestore.collection<Museumimage>('imagesCollectionMuseum').doc(museumImage.id).update(firestoreMuseumImage);
  }

  deleteMuseumImage(museumImageId: string, pathToImage: string): Promise<void> {
    this.storage.ref(pathToImage).delete();
    return this.firestore.collection<Museumimage>('imagesCollectionMuseum').doc(museumImageId).delete();
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
