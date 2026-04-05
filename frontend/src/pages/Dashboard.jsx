import React, { Suspense } from "react";
import { useContext } from "react";
import { ScaleLoader } from "react-spinners";
import { TradeContext } from "../context/TradesContext";
const Stats = React.lazy(() => import("../components/stats/Stats"));

export default function Dashboard() {
  const { fetchLoading } = useContext(TradeContext);
  return (
    <section className="grid h-full w-full items-center justify-center grid-cols-8 p-4 xl:p-8 gap-4 gap-x-8 lg:gap-4 xl:gap-8">
      <Suspense
        fallback={
          <div className="flex h-full w-full justify-between items-center">
            <ScaleLoader color="##20dfbc" />
          </div>
        }
      >
        {fetchLoading ? (
          <div className="col-start-1 col-end-8 row-start-1 row-end-2 flex items-center justify-center h-full w-full">
            <ScaleLoader color="#20dfbc" />
          </div>
        ) : (
          <Stats />
        )}
      </Suspense>
    </section>
  );
}
