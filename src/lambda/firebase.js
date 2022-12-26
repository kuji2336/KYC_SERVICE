import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc} from "firebase/firestore";
const dotenv = require("dotenv");
dotenv.config();


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const APP = initializeApp(firebaseConfig);
const DB = getFirestore(APP);


export const saveOrCheckUser = async (userRef, userId, res)=>{
  const docRef = doc(DB, "users", userRef);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    res.send({data: docSnap.data()})
  }else{
      setDoc(doc(DB, "users", userRef), {
        wallet_address: userRef,
        sumsub_user_id: userId,
        external_user_id: userRef
      }).then(()=>{
         res.send({data: docSnap.data()})
      }).catch(()=>{
        res.status(500).send({error: true})
      });
  }
}




