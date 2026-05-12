import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, collectionData, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  getCollection<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  getCollectionOrdered<T>(collectionName: string, field: string, direction: 'asc' | 'desc' = 'desc'): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    const q = query(ref, orderBy(field, direction));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getDocsByField<T>(collectionName: string, field: string, value: any): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    const q = query(ref, where(field, '==', value));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  async getDocById<T>(collectionName: string, docId: string): Promise<T | null> {
    const ref = doc(this.firestore, collectionName, docId);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as T : null;
  }

  async addDoc(collectionName: string, data: any): Promise<DocumentReference> {
    const ref = collection(this.firestore, collectionName);
    return await addDoc(ref, { ...data, createdAt: new Date().toISOString() });
  }

  async setDoc(collectionName: string, docId: string, data: any): Promise<void> {
    const ref = doc(this.firestore, collectionName, docId);
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() });
  }

  async updateDoc(collectionName: string, docId: string, data: any): Promise<void> {
    const ref = doc(this.firestore, collectionName, docId);
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
  }

  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    const ref = doc(this.firestore, collectionName, docId);
    await deleteDoc(ref);
  }
}
