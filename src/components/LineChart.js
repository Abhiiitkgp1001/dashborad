import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;

function LineChart({ data }) {
  const [chartData, setChartData] = useState(data);

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
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
      tickAmount: 10, // Adjust this number to control the number of x-axis ticks
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
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="line"
        height={350}
      />
    </div>
  );
}

export default LineChart;
