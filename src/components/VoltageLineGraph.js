import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dataAction } from "../store";
import LineChart from "./LineChart";

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
  //   const voltage = useSelector((state) => state.voltage);
  const [activeBMS, setActiveBMS] = useState(selectedBmsIndex);
  const voltage = useSelector((state) => state.voltage);
  const dispatch = useDispatch();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const bms_buttons = Array.from(
    { length: num_bms - 0 },
    (_, index) => 0 + index
  );
    const components = []
    for (let i = 0; i < num_bms; i++) {
        var t = `t ${i}`;
        components.push({
            dataIndex: t,
            key: i,
            render: (t) =>
                <LineChart keyIndex={`bms_${t}`} />
        })
    }
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
    let series_data = {};
    let x = [];
    let voltage_list = [];
    if (num_bms > 0) {
      for (let j = 0; j < num_bms; j++) {
        series_data["bms_" + j] = [];
        if (Object.keys(voltage).length !== 0) {
          for (let k = 0; k < voltage["bms " + j][0].length; k++) {
            //length of all volatges coming in series will be same as number are voltages are fixed
            voltage_list = [];
            for (let i = 0; i < voltage["bms " + j].length; i++) {
              if (voltage["bms " + j][i][k] !== undefined) {
                // console.log("bms " + j + "v_" + k, voltage["bms " + j][i][k]);
                voltage_list.push(voltage["bms " + j][i][k]);
              }
              x.push(i);
            }
            if (voltage["bms " + j][0][k] == undefined) {
              break;
            }
            series_data["bms_" + j].push({
              name: "V_" + (k + 1),
              data: voltage_list,
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
        categories: x,
        series: series_data,
      };
      dispatch(dataAction.setG_data(data));
    } else {
      const data = {
        categories: [],
        series: [],
      };
      dispatch(dataAction.setG_data(data));
    }
  }, [voltage]);

  useEffect(() => {
    setSelectedComponent(<LineChart keyIndex={`bms_${activeBMS}`} />);
  }, [activeBMS]);
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
      {selectedComponent}
    </Container>
  );
};

export default VoltageLineChart;
