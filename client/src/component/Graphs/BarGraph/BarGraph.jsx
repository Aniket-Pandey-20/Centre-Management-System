import {useEffect, useState,useRef} from "react";
import Chart from "chart.js/auto";
import { BarElement,CategoryScale,LinearScale,Tooltip,Legend } from "chart.js";
import { Bar,getElementsAtEvent} from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';//For chart lables
Chart.register(BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);//For chart lables

export default function BarGraph({Data}) {
  const [chartData, setChartData] = useState();
  const chartRef = useRef();
  const options = {
    plugins: [{
      title: {
        display: true,
        text: ""
      },
      legend: {
        display: false
      },
    }],
    layout:{
      padding:5
    },
  }
  useEffect(()=>{
    setChartData({
      labels: Data.map((data) =>{
        if(data.state_name === 'Andaman and Nicobar Islands'){
          return "Andaman and Nicobar"
        }else if(data.state_name === "Dadra and Nagar Haveli & Daman and Diu"){
          return 'Daman and Diu'
        }else if(data.state_name === 'Jammu and Kashmir'){
          return 'J & K'
        }else{
          return data.state_name;
        }
      }), 
      datasets: [
        {
          label: "No. of centre",
          data: Data.map((data) => data.state_centre_cnt),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(201, 203, 207, 0.5)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 0.5
        }
      ]
    })
  },[Data])
  const onClick = (e)=>{
    if(getElementsAtEvent(chartRef.current,e).length > 0){
      const eleIndex = getElementsAtEvent(chartRef.current,e)[0].index;
      const state= Data.filter(d => {
        if(chartData.labels[eleIndex]=== 'Andaman and Nicobar'){
          chartData.labels[eleIndex]= "Andaman and Nicobar Islands";
        }else if(chartData.labels[eleIndex]=== 'Daman and Diu'){
          chartData.labels[eleIndex]= "Dadra and Nagar Haveli & Daman and Diu";
        }else if(chartData.labels[eleIndex] === 'J & K'){
          chartData.labels[eleIndex] = "Jammu and Kashmir";
        }
        return(d.state_name == chartData.labels[eleIndex]);
      })[0];
      window.location.replace(`/centrelist?state_id=${state.state_id}&state=${state.state_name}`)
    }
  }

  return (
    <div className="BarGraph">
      {chartData && 
       <div className="chart-container">
        <Bar 
          data={chartData}
          options={options}
          onClick={onClick}
          ref = {chartRef}
          style={{padding:'0 10px'}}
        />
      </div>}
    </div>
  );
}