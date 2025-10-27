import "./dashboard.css";
import Stats from "../../components/stats/Stats";
import PnlChart from "../../components/pnlchart/pnlChart";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Stats />
      <PnlChart />
    </div>
  );
}
