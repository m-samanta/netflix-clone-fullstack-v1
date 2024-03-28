import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";
  import { FirebaseApp } from "firebase/app";
  import { getAuth } from "firebase/auth";
import { Subscription } from "@/typing";
  
  
  const getPremiumStatus = async (app: FirebaseApp) => {
    const auth = getAuth(app);
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not logged in");
  
    const db = getFirestore(app);
    const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
    const q = query(subscriptionsRef, where("status", "in", ["trialing", "active"]));
  
    return new Promise<Subscription[]>((resolve, reject) => {
      onSnapshot(
        q,
        (snapshot) => {
          console.log("Subscription snapshot", snapshot.docs.length);
          if (snapshot.docs.length === 0) {
            console.log("No active or trialing subscriptions found");
            resolve([]);
          } else {
            console.log("Active or trialing subscription found");
            const subscriptionData: Subscription[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as Subscription;
              subscriptionData.push(data);
            });
            resolve(subscriptionData);
          }
        },
        reject
      );
    });
  };
  
  export default getPremiumStatus;
  