import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;

function LineChart({ data, isInFullScreen }) {
  const [chartData, setChartData] = useState(data);
  console.log("data line chart: ")
  console.log(data[0]?.name);
  var labelY = "Voltage";
  if(data[0]?.name === "T_1"){
    labelY = "Temperature";
  }else if (data[0]?.name === "V_1") {
    labelY = "Voltage";
  } else if (data[0]?.name === "C") {
    labelY = "Current";
  } else {
    labelY = " ";
  }
  useEffect(() => {
    const visibleSeries = data.filter((series) => {
      return series.visible;
    });
    // console.log("visibleSeries", visibleSeries);
    setChartData(visibleSeries);
  }, [data]);

  const chartOptions = {
    id: "chart",
    stroke: {
      width: 1,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
      labels: {
        format: 'dd/MM/yy HH:mm:ss',
        // datetimeFormatter: {
        //   year: "yyyy",
        //   month: "MMM 'yy",
        //   day: "dd MMM",
        //   hour: "HH:mm",
        // },
      },
      // tickAmount: 10, // Adjust this number to control the number of x-axis ticks
    },
    yaxis: {
      show: true,
      showAlways: true,
      title: {
        text: labelY,
      },
      label: {
        show: true,
      },
    },
    colors: [
      "#ff5733", // Red
      "#33ff77", // Green
      "#33b5ff", // Blue
      "#ff66b2", // Pink
      "#a64d79", // Purple
      "#ffcb77", // Peach
      "#66e0ff", // Sky Blue
      "#a6ccff", // Light Blue
      "#ff99e6", // Light Pink
      "#99ff66", // Lime Green
      "#ffd700", // Gold
      "#ffa07a", // Light Salmon
      "#87cefa", // Light Sky Blue
      "#ff6347", // Tomato
      "#7b68ee", // Medium Slate Blue
      "#20b2aa", // Light Sea Green
    ],
    tooltip:{
      enabled:true,
      style:{
        fontSize: isInFullScreen? '12px' : '10px'
      }
    }
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="line"
        height={isInFullScreen ? 600 : 350}
      />
    </div>
  );
}

export default LineChart;
