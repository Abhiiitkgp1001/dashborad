import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dataAction } from "../store";
import ChartLegend from "./ChartLegends/ChartLegend";
import LineChart from "./LineChart";
const _ = require("lodash");

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

const VoltageLineChart = ({ num_bms, selectedBmsIndex }) => {
  const [activeBMS, setActiveBMS] = useState(selectedBmsIndex);
  const voltage = useSelector((state) => state.voltage);
  const voltageChartData = useSelector((state) => state.voltageChartData);
  const [ChartData, setChartData] = useState(voltageChartData);
  const dispatch = useDispatch();
  const bms_buttons = Array.from(
    { length: num_bms - 0 },
    (_, index) => 0 + index
  );

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

  useEffect(() => {
    setChartData((prevData) => {
      const updatedData = _.cloneDeep(prevData);
      const currentDataIndex = 0;
      if (num_bms > 0) {
        for (let j = 0; j < num_bms; j++) {
          updatedData["bms_" + j] = [];
          if (Object.keys(voltage).length !== 0) {
            for (
              let i = currentDataIndex;
              i < voltage["bms " + j].length;
              i++
            ) {
              for (let k = 0; k < voltage["bms " + j][0].length; k++) {
                //length of all volatges coming in series will be same as number are voltages are fixed
                if (voltage["bms " + j][i][k] !== undefined) {
                  if (k < updatedData["bms_" + j].length) {
                    updatedData["bms_" + j][k].data.push(
                      voltage["bms " + j][i][k]
                    );
                  } else {
                    updatedData["bms_" + j].push({
                      name: "V_" + (k + 1),
                      data: [],
                      visible: prevData["bms_" + j]
                        ? prevData["bms_" + j][k].visible
                        : true,
                    });
                    updatedData["bms_" + j][k].data.push(
                      voltage["bms " + j][i][k]
                    );
                  }
                } else {
                  break;
                }
              }
            }
          }
        }
      }

      return updatedData;
    });
  }, [voltage]);

  useEffect(() => {
    dispatch(dataAction.setVoltageChartData(ChartData));
  }, [ChartData]);

  const toggleSeriesVisibility = (seriesIndex) => {
    setChartData((prevData) => {
      const updatedData = _.cloneDeep(prevData);
      updatedData[`bms_${activeBMS}`][seriesIndex].visible =
        !updatedData[`bms_${activeBMS}`][seriesIndex].visible;
      return updatedData;
    });
  };

  return (
    <Container>
      <Container>
        <TabContainer>
          {bms_buttons.map((button) => (
            <GreenTab key={button} onClick={() => setActiveBMS(button)}>
              BMS{button}
            </GreenTab>
          ))}
        </TabContainer>
      </Container>
      <Container>
        <LineChart
          data={
            ChartData[`bms_${activeBMS}`] ? ChartData[`bms_${activeBMS}`] : []
          }
        />
        <ChartLegend
          data={
            ChartData[`bms_${activeBMS}`] ? ChartData[`bms_${activeBMS}`] : []
          }
          onLegendItemClick={toggleSeriesVisibility}
        />
      </Container>
    </Container>
  );
};

export default VoltageLineChart;
