import Stats from "../components/stats/Stats.js";

export default function Dashboard() {
  return (
    <section className="grid h-full w-full items-center justify-center grid-cols-8 p-4 xl:p-8 gap-4 gap-x-8 lg:gap-4 xl:gap-8">
      <Stats />
    </section>
  );
}
