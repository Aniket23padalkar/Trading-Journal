import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";

export default async function uploadLocalTradesToFirebase() {
  const user = auth.currentUser;
  if (!user) return;

  const trades = JSON.parse(localStorage.getItem("tradesV2")) || [];
  if (trades.length === 0) return;
  const userTradesRef = collection(db, "users", user?.uid, "trades");

  const existingSnapshot = await getDocs(userTradesRef);
  if (!existingSnapshot.empty) {
    console.log("Firestore already has trades — skipping migration.");
    return;
  }

  for (const trade of trades) {
    const formattedTrade = {
      formData: trade.formData,
      entries: trade.entries,
      stats: trade.stats,
      createdAt: serverTimestamp(),
    };
    await addDoc(userTradesRef, formattedTrade);
  }
  localStorage.removeItem("trades");
  localStorage.removeItem("tradesV2");
}
