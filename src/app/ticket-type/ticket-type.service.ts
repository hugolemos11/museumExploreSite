import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';
import { Ticket, TicketType } from './ticket-type';

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getAllTicketsFromMuseumFiltered(museumId: string): Observable<Ticket[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.firestore.collection<Ticket>('tickets', ref =>
      ref.where('museumId', '==', museumId)
        .where('purchaseDate', '>=', sevenDaysAgo)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              museumId: element['museumId'],
              typeId: element['typeId'],
              amount: element['amount'],
              purchaseDate: element['purchaseDate'].toDate(),
            }
          })
        }),
      );
  }

  getAllTicketsTypesFromMuseum(museumId: string): Observable<TicketType[]> {
    return this.firestore.collection<TicketType>('ticketTypes', ref =>
      ref.where('museumId', '==', museumId)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              museumId: element['museumId'],
              type: element['type'],
              price: element['price'],
              description: element['description'],
              maxToBuy: element['maxToBuy'],
              pathToImage: element['pathToImage'],
            }
          })
        }),
      );
  }

  getAllTickets(): Observable<Ticket[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.firestore.collection<Ticket>('tickets', ref =>
      ref.where('purchaseDate', '>=', sevenDaysAgo)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              museumId: element['museumId'],
              typeId: element['typeId'],
              amount: element['amount'],
              purchaseDate: element['purchaseDate'].toDate(),
            }
          })
        }),
      );
  }

  getAllTicketsTypes(): Observable<TicketType[]> {
    return this.firestore.collection<TicketType>('ticketTypes').valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element.id,
              museumId: element['museumId'],
              type: element['type'],
              price: element['price'],
              description: element['description'],
              maxToBuy: element['maxToBuy'],
              pathToImage: element['pathToImage'],
            }
          })
        }),
      );
  }

  getTicketTypeById(ticketTypeId: string): Observable<TicketType> {
    return this.firestore.collection<Event>('ticketTypes').doc<TicketType>(ticketTypeId).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data() as TicketType;
        const id = snapshot.payload.id;

        return {
          id: id,
          museumId: data['museumId'],
          type: data['type'],
          price: data['price'],
          description: data['description'],
          maxToBuy: data['maxToBuy'],
          pathToImage: data['pathToImage'],
        }
      })
    );
  }

  createTicketType(ticketType: TicketType): Promise<any> {
    var firestoreTicketType: any = {
      id: ticketType.id,
      museumId: ticketType.museumId,
      type: ticketType.type,
      price: ticketType.price,
      description: ticketType.description,
      maxToBuy: ticketType.maxToBuy,
      pathToImage: ticketType.pathToImage,
    };

    return this.firestore.collection<TicketType>('ticketTypes').add(firestoreTicketType);
  }

  updateTicketType(ticketType: TicketType): Promise<void> {
    var firestoreTicketType: any = {
      'id': ticketType.id,
      'museumId': ticketType.museumId,
      'type': ticketType.type,
      'price': ticketType.price,
      'description': ticketType.description,
      'maxToBuy': ticketType.maxToBuy,
      'pathToImage': ticketType.pathToImage,
    };
    return this.firestore.collection<TicketType>('ticketTypes').doc(ticketType.id).update(firestoreTicketType);
  }

  deleteTicketType(ticketTypeId: string): Promise<void> {
    return this.firestore.collection<TicketType>('ticketTypes').doc(ticketTypeId).delete();
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
