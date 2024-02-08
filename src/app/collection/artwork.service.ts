import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Artwork } from './artwork';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ArtWorkImage } from './artworkimage';

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

  getOtherImages(artWorkId: string): Observable<ArtWorkImage[]> {
    return this.firestore.collection<ArtWorkImage[]>('imagesCollectionArtWork', ref => ref.where('artWorkId', '==', artWorkId))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              artWorkId: element['artWorkId'],
              pathToImage: element['pathToImage'],
            }
          })
        })
      );
  }

  createArtWorkImage(artWorkImage: ArtWorkImage): Promise<any> {
    var firestoreArtWorkImage: any = {
      'artWorkId': artWorkImage.artWorkId,
      'pathToImage': artWorkImage.pathToImage,
    };

    return this.firestore.collection<ArtWorkImage>('imagesCollectionArtWork').add(firestoreArtWorkImage);
  }

  updateArtWorkImage(artWorkImage: ArtWorkImage): Promise<void> {
    var firestoreArtWorkImage: any = {
      'artWorkId': artWorkImage.artWorkId,
      'pathToImage': artWorkImage.pathToImage,
    };
    return this.firestore.collection<ArtWorkImage>('imagesCollectionArtWork').doc(artWorkImage.id).update(firestoreArtWorkImage);
  }

  deleteArtWorkImage(artWorkImageId: string, pathToImage: string): Promise<void> {
    this.storage.ref(pathToImage).delete();
    return this.firestore.collection<ArtWorkImage>('imagesCollectionArtWork').doc(artWorkImageId).delete();
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
