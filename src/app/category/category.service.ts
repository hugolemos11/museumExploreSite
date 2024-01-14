import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from './category';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: AngularFirestore) { }

  getAllCategoriesFromMuseum(museumId: string): Observable<Category[]> {
    return this.firestore.collection<Category>('categories', ref =>
      ref.where('museumId', '==', museumId)
    ).valueChanges({ idField: 'id' })
      .pipe(
        map((data: any[]) => {
          return data.map(element => {
            return {
              id: element['id'],
              museumId: element['museumId'],
              description: element['description'],
            }
          })
        }),
      );
  }
}
