import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import LineChart from "../LineChart";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;
const BMsSelectButtoneader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TabContainer = styled.div`
  border: 1px solid #ccc;
  margin: auto;
  display: flex;
  flex-direction: row;
`;

const GreenTab = styled.div`
  padding: 10px 20px;
  margin: 5px;
  width: fit-content;
  text-align: center;
  cursor: pointer;
  background-color: #c9f7f5;
  border-radius: 6px;
  color: #1bc5bd;
  cursor: pointer;
  font-family: Poppins;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  &:hover {
    color: #c9f7f5;
    background-color: #1bc5bd;
  }
`;
const GreenButton = styled.div`
  margin-top: auto;
  display: flex;
  padding: 8px 16px;
  background-color: #c9f7f5;
  border-radius: 6px;
  color: #1bc5bd;
  cursor: pointer;
  font-family: Poppins;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  &:hover {
    color: #c9f7f5;
    background-color: #1bc5bd;
  }
`;

const CurrentLineChart = ({ selectedBmsIndex, isInFullScreen }) => {
  const time = useSelector((state) => state.timestamp);
  const current = useSelector((state) => state.current);
  const colors = [
    0xff5733, // Red
    0x33ff77, // Green
    0x33b5ff, // Blue
    0xff66b2, // Pink
    0xa64d79, // Purple
    0xffcb77, // Peach
    0x66e0ff, // Sky Blue
    0xa6ccff, // Light Blue
    0xff99e6, // Light Pink
    0x99ff66, // Lime Green
    0xffd700, // Gold
    0xffa07a, // Light Salmon
    0x87cefa, // Light Sky Blue
    0xff6347, // Tomato
    0x7b68ee, // Medium Slate Blue
    0x20b2aa, // Light Sea Green
  ];

  let [g_data, setData] = useState({
    options: {
      chart: {
        id: "apexchart-example",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
  });

  useEffect(() => {
    let x = [];
    let series = [];
    let current_list = [];
    if (current.length !== 0) {
      for (let k = 0; k < current.length; k++) {
        //length of all volatges coming in series will be same as number are voltages are fixed
        current_list.push({
          x: time[k],
          y: current[k],
        });
        x.push(k);
      }
    }
    series.push({
      name: "Current",
      data: current_list,
    });
    const data = {
      series: series,
    };
    setData(data);
  }, [current, time]);
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
  };

  return (
    <Container>
      <Chart
        options={chartOptions}
        series={g_data.series}
        type="line"
        width={"100%"}
        height={isInFullScreen ? 600: 350}
      />
    </Container>
  );
};

export default CurrentLineChart;
