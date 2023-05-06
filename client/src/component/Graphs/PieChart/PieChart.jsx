import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import react,{ useState } from "react";
import { Pie } from "react-chartjs-2";

Chart.register(CategoryScale);
  
export default function PieChart({Data}) {
  const [chartData, setChartData] = useState({
    labels: ["Approved","Rejected","Not Checked"], 
    datasets: [
      {
        label:" ",
        data: [Data.approved,Data.rejected,Data.inProcess],
        backgroundColor: [
          "rgb(104,212,201)",
          "rgb(254,165,150)",
          "rgba(201, 203, 207)"
        ],
      }
    ]
  });



  return (
    <div className="chart-container">
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: ""
            }
          }
        }}
      />
    </div>
  );
}