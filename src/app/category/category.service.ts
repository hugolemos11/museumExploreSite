import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from './category';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Artwork } from '../collection/artwork';

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

  getCategoryById(categoryId: string): Observable<Category> {
    return this.firestore.collection<Category>('categories').doc<Category>(categoryId).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data() as Category;
        const id = snapshot.payload.id;

        return {
          id: id,
          museumId: data['museumId'],
          description: data['description']
        };
      })
    );
  }

  createCategory(category: Category): Promise<any> {
    return new Promise((resolve, reject) => {
      const categories$ = this.firestore.collection<Category>('categories', ref =>
        ref.where('museumId', '==', category.museumId).where('description', '==', category.description.toLowerCase())
      ).snapshotChanges();

      categories$.subscribe(
        (categories) => {
          console.log(categories);
          if (categories.length > 0) {
            reject(new Error('Não é possível excluir categorias com obras associadas!'));
          } else {
            const firestoreCategory: any = {
              'museumId': category.museumId,
              'description': category.description.toLowerCase()
            };

            resolve(this.firestore.collection<Category>('categories').add(firestoreCategory));
          }
        },
        error => {
          console.error(`Error querying artworks: ${error.message}`);
          reject(error);
        }
      );
    });
  }

  updateCategory(category: Category): Promise<void> {
    var firestoreCategory: any = {
      'museumId': category.museumId,
      'description': category.description.toLowerCase(),
    };
    console.log(category.id)
    return this.firestore.collection<Category>('categories').doc(category.id).update(firestoreCategory);
  }

  deleteCategory(categoryId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const artworks$ = this.firestore.collection<Artwork>('artWorks', ref =>
        ref.where('categoryId', '==', categoryId)
      ).snapshotChanges();

      artworks$.subscribe(
        (artworks: DocumentChangeAction<Artwork>[]) => {
          if (artworks.length > 0) {
            reject(new Error('Não é possibel excluir categorias com obras associadas!'));
          } else {
            resolve(this.firestore.collection<Category>('categories').doc(categoryId).delete());
          }
        },
        error => {
          console.error(`Error querying artworks: ${error.message}`);
          reject(error);
        }
      );
    });
  }
}
