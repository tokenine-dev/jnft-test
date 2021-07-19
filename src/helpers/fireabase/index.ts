import { firestore } from 'libs/firebase-sdk';

// Load this from store and set caching and persistence storage
export async function getWorksByIndex (indexName: string, options?: any) {
  try {
       const docRef = firestore.collection("works_index").doc(indexName)

       docRef.onSnapshot((doc) => {
            console.log("Current data: ", doc.data());
       })

       const doc = await docRef.get()
       if (doc.exists) {
            const indexData = doc.data()
            return indexData
       }
       return []

  } catch (error) {
       console.error(error)
  }
}