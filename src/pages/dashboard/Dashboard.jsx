import Stats from "../../components/stats/Stats";
import PnlChart from "../../components/pnlchart/pnlChart";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-8 p-8 gap-8">
      <Stats />
      {/* <PnlChart /> */}
      {/* <div className="working-on">
        <h1>Sorry We are woking on here!</h1>
      </div> */}
    </div>
  );
}
