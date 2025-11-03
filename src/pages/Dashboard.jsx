import Stats from "../components/stats/Stats";

export default function Dashboard() {
  return (
    <div className="grid h-full grid-cols-8 p-8 gap-8">
      <Stats />
    </div>
  );
}
