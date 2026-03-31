import React, { Suspense } from "react";
import { ScaleLoader } from "react-spinners";
const Stats = React.lazy(() => import("../components/stats/Stats"));

export default function Dashboard() {
  return (
    <section className="grid h-full grid-cols-8 p-4 xl:p-8 gap-4 gap-x-8 lg:gap-4 xl:gap-8">
      <Suspense
        fallback={
          <div className="flex h-full w-full justify-between items-center">
            <ScaleLoader color="##20dfbc" />
          </div>
        }
      >
        <Stats />
      </Suspense>
    </section>
  );
}
