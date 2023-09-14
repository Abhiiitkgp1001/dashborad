import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux/es/hooks/useSelector";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;

const LineChart = ({ keyIndex }) => {
  const G_data = useSelector((state) => state.g_data);
  const [activeChart, setActiveChart] = useState(null);
  console.log("G_data: ", G_data);
  let [g_data, setData] = useState({
    options: {
      chart: {
        id: keyIndex,
      },
      xaxis: {
        categories: [],
      },
      stroke: {
        width: 1,
      },
      //   legend: {
      //     show: activeChart === 'chart1', // Enable the legend for chart1 if it's active
      //   },
    },
    series: [],
  });
  const toggleDataSeries = function (chart, seriesIndex, opts) {
    console.log("series- " + seriesIndex + "'s marker was clicked");
  };
  useEffect(() => {
    console.log("index: ", keyIndex);
    if (Object.keys(G_data).length !== 0) {
      const legends = G_data.series[keyIndex]
        ? G_data.series[keyIndex].map((obj) => obj.name)
        : [];
      const data = {
        options: {
          chart: {
            id: keyIndex,
          },
          xaxis: {
            categories: G_data.categories,
          },
          stroke: {
            width: 1,
          },
          legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: "bottom",
            horizontalAlign: "center",
            customLegendItems: legends,

            // onItemClick: {
            //   toggleDataSeries: true,
            // },
          },
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: "#fff",
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: toggleDataSeries,
            offsetX: 0,
            offsetY: 0,
          },
        },
        series: G_data.series[keyIndex] ? G_data.series[keyIndex] : [],
      };
      setData(data);
      console.log("graphId: ", data.options.chart.id);
    }
  }, [G_data]);

  return (
    <Chart
      options={g_data.options}
      series={g_data.series}
      type="line"
      width={700}
      height={320}
    />
  );
};

export default LineChart;
