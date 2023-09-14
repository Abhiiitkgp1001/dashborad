import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux/es/hooks/useSelector";
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

const TemperatureLineChart = ({ num_bms, selectedBmsIndex }) => {
  const temperature = useSelector((state) => state.temp);
  const [activeBMS, setActiveBMS] = useState(selectedBmsIndex);
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

  console.log(num_bms);
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
    // setBMSlist(
    //   Array.from({ length: num_bms - 0 + 1 }, (_, index) => 0 + index)
    // );
    let series_data = {};
    let x = [];
    let temperature_list = [];
    if (num_bms > 0) {
      for (let j = 0; j < num_bms; j++) {
        series_data["bms_" + j] = [];
        if (Object.keys(temperature).length !== 0) {
          for (let k = 0; k < temperature["bms " + j][0].length; k++) {
            //length of all volatges coming in series will be same as number are temperatures are fixed
            temperature_list = [];
            for (let i = 0; i < temperature["bms " + j].length; i++) {
              if (temperature["bms " + j][i][k] !== undefined) {
                console.log(
                  "bms " + j + "v_" + k,
                  temperature["bms " + j][i][k]
                );
                temperature_list.push(temperature["bms " + j][i][k]);
              }
              x.push(i);
            }

            series_data["bms_" + j].push({
              name: "T_" + k,
              data: temperature_list,
            });
          }
        } else {
          for (let j = 0; j < num_bms - 1; j++) {
            series_data["bms_" + j] = [];
          }
          x = [];
        }
      }
      const data = {
        options: {
          chart: {
            id: "apexchart-example",
          },
          xaxis: {
            categories: x,
          },
          stroke: {
            width: 1,
          },
        },
        series: series_data["bms_" + activeBMS],
      };
      setData(data);
    } else {
      const data = {
        options: {
          chart: {
            id: "apexchart-example",
          },
          xaxis: {
            categories: [],
          },
          stroke: {
            width: 1,
            curve: "smooth",
          },
        },
        series: [],
      };
      setData(data);
    }
  }, [temperature, num_bms, activeBMS]);
  console.log("numBms", num_bms);
  return (
    <Container>
      <Container>
        {Array.from({ length: num_bms - 0 + 1 }, (_, index) => 0 + index).map(
          (bms) => {
            <GreenTab onClick={() => setActiveBMS(bms)}>
              {"BMS " + bms}
            </GreenTab>;
          }
        )}
      </Container>
      <Chart
        options={g_data.options}
        series={g_data.series}
        type="line"
        width={500}
        height={320}
      />
    </Container>
  );
};

export default TemperatureLineChart;
