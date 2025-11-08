import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function useTradesData() {
  const { user, authLoading } = useContext(AuthContext);
  const [trades, setTrades] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.uid) {
      setFetchLoading(false);
      return;
    }

    setFetchLoading(true);

    const tradesRef = collection(db, "users", user?.uid, "trades");

    const tradesQuery = query(tradesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      tradesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTrades(data);
        setFetchLoading(false);
      },
      (error) => {
        console.log(error);
        alert(error.message);
        setFetchLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { trades, fetchLoading };
}
