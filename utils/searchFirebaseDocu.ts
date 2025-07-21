import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../app/firbase';

export const searchDocument = (field: string, value: string) => {
  const usersCollection = collection(db, 'users');

  const fieldQuery = query(usersCollection, where(field, '==', value));

  return getDocs(fieldQuery)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('Document found:', doc.id, ' => ', doc.data());
        localStorage.setItem("firebaseDocuId", doc.id);
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error('Error searching for document: ', error);
      throw error;
    });
};