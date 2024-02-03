import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Artwork } from './artwork';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getAllArtWorksFromMuseum(museumId: string): Observable<Artwork[]> {
    return this.firestore.collection<Artwork>('artWorks', ref =>
      ref.where('museumId', '==', museumId)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              name: element['name'],
              artist: element['artist'],
              year: element['year'],
              categoryId: element['categoryId'],
              description: element['description'],
              museumId: element['museumId'],
              pathToImage: element['pathToImage'],
            }
          })
        }),
      );
  }

  getArtWorkById(artWorkId: string): Observable<Artwork> {
    return this.firestore.collection<Artwork>('artWorks').doc<Artwork>(artWorkId).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data() as Artwork;
        const id = snapshot.payload.id;

        return {
          id: id,
          name: data['name'],
          artist: data['artist'],
          year: data['year'],
          categoryId: data['categoryId'],
          description: data['description'],
          museumId: data['museumId'],
          pathToImage: data['pathToImage'],
        };
      })
    );
  }

  createArtWork(artWork: Artwork): Promise<any> {
    var firestoreArtWork: any = {
      'id': artWork.id,
      'name': artWork.name,
      'artist': artWork.artist,
      'year': artWork.year,
      'categoryId': artWork.categoryId,
      'description': artWork.description,
      'museumId': artWork.museumId,
      'pathToImage': artWork.pathToImage,
    };

    return this.firestore.collection<Artwork>('artWorks').add(firestoreArtWork);
  }

  updateArtWork(artWork: Artwork): Promise<void> {
    var firestoreArtWork: any = {
      'id': artWork.id,
      'name': artWork.name,
      'artist': artWork.artist,
      'year': artWork.year,
      'categoryId': artWork.categoryId,
      'description': artWork.description,
      'museumId': artWork.museumId,
      'pathToImage': artWork.pathToImage,
    };
    return this.firestore.collection<Artwork>('artWorks').doc(artWork.id).update(firestoreArtWork);
  }

  deleteArtWork(artWorkId: string): Promise<void> {
    return this.firestore.collection<Artwork>('artWorks').doc(artWorkId).delete();
  }

  getOtherImages(artWorkId: string): Observable<string[]> {
    console.log(artWorkId)
    return this.firestore.collection<string[]>('imagesCollectionArtWork', ref => ref.where('artWorkId', '==', artWorkId))
      .valueChanges()
      .pipe(
        map((data: any[]) => {
          console.log(data)
          return data.map(element => element['pathToImage']);
        })
      );
  }

  downloadFile(fileName: string): Observable<string> {
    console.log(fileName)
    const fileRef = this.storage.ref(`${fileName}`);
    return fileRef.getDownloadURL();
  }

  uploadFile(fileName: string, file: File): void {
    const filePath = `${fileName}`;
    this.storage.upload(filePath, file);
  }
}
