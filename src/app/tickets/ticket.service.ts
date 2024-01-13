import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Ticket, TicketType } from './ticket';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private firestore: AngularFirestore) { }


  getAllTicketsFromMuseum(museumId: string): Observable<Ticket[]> {
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
              ticketTypeId: element['ticketTypeId'],
              purchaseDate: element['purchaseDate'].toDate(),
            }
          })
        }),
      );
  }

  getAllTicketsTypes(museumId: string): Observable<TicketType[]> {
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
            }
          })
        }),
      );
  }
}
