// Firestore Database Service
// Provides CRUD operations, real-time listeners, and advanced queries for EduFlow

import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, logCustomEvent } from './firebaseConfig';

class FirestoreService {
  // Create user profile
  async createUserProfile(userData) {
    try {
      const docRef = doc(db, 'users', userData.uid);
      await setDoc(docRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      logCustomEvent('user_profile_created', { role: userData.role });
      return userData.uid;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid, userData) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Add document to collection
  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      logCustomEvent('document_created', { collection: collectionName });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Update document
  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      logCustomEvent('document_updated', { collection: collectionName });
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete document
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      logCustomEvent('document_deleted', { collection: collectionName });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Get all documents from collection
  async getDocuments(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Query documents with filters
  async queryDocuments(collectionName, filters = [], orderByField = null, limitCount = null) {
    try {
      let q = collection(db, collectionName);
      const conditions = [];

      // Add filters
      filters.forEach(filter => {
        conditions.push(where(filter.field, filter.operator, filter.value));
      });

      // Build query
      let queryBuilt = query(q, ...conditions);

      if (orderByField) {
        queryBuilt = query(q, ...conditions, orderBy(orderByField.field, orderByField.direction || 'asc'));
      }

      if (limitCount) {
        queryBuilt = query(q, ...conditions, limit(limitCount));
      }

      const querySnapshot = await getDocs(queryBuilt);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Real-time listener for collection
  onCollectionChange(collectionName, callback) {
    try {
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(docs);
      });
    } catch (error) {
      console.error('Error setting up listener:', error);
      throw error;
    }
  }

  // Real-time listener for specific document
  onDocumentChange(collectionName, docId, callback) {
    try {
      return onSnapshot(doc(db, collectionName, docId), (snapshot) => {
        if (snapshot.exists()) {
          callback({
            id: snapshot.id,
            ...snapshot.data()
          });
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Error setting up document listener:', error);
      throw error;
    }
  }

  // Batch write operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(db);

      operations.forEach(op => {
        if (op.type === 'set') {
          batch.set(doc(db, op.collection, op.id), op.data);
        } else if (op.type === 'update') {
          batch.update(doc(db, op.collection, op.id), op.data);
        } else if (op.type === 'delete') {
          batch.delete(doc(db, op.collection, op.id));
        }
      });

      await batch.commit();
      logCustomEvent('batch_write_completed', { operationCount: operations.length });
      return true;
    } catch (error) {
      console.error('Error batch writing:', error);
      throw error;
    }
  }

  // Search documents
  async searchDocuments(collectionName, searchTerm) {
    try {
      const docs = await this.getDocuments(collectionName);
      return docs.filter(doc => {
        return Object.values(doc).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  // Get user activity
  async getUserActivity(uid, limitCount = 50) {
    try {
      return await this.queryDocuments(
        'activities',
        [where('userId', '==', uid)],
        { field: 'timestamp', direction: 'desc' },
        limitCount
      );
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw error;
    }
  }

  // Log user activity
  async logActivity(uid, activityType, metadata = {}) {
    try {
      await this.addDocument('activities', {
        userId: uid,
        type: activityType,
        metadata,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }
}

export default new FirestoreService();
