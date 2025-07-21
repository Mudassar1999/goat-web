import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from '../app/firbase';
import { toast } from "react-toastify";

async function removeFirebaseDocument(documentId: string): Promise<void> {
     const usersCollection = collection(db, "users");
     const userDocRef = doc(usersCollection, documentId);
     try {
          await deleteDoc(userDocRef);
          console.log("Document successfully removed!");
          localStorage.clear();
          toast.success("Your account deleted!")
     } catch (error) {
          toast.error("Something went wrong!")
          console.error("Error removing document: ", error);
     }
}

export default removeFirebaseDocument