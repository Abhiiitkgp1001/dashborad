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
      tickAmount: 10, // Adjust this number to control the number of x-axis ticks
    },
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
