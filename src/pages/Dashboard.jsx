import Stats from "../components/stats/Stats";

export default function Dashboard() {
  return (
    <div className="grid h-full grid-cols-8 p-4 xl:p-8 gap-4 gap-x-8 lg:gap-4 xl:gap-8">
      <Stats />
    </div>
  );
}
