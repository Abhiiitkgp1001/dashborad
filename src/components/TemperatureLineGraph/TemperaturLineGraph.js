import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dataAction } from "../../store";
import ChartLegend from "../ChartLegends/ChartLegend";
import LineChart from "../LineChart";
import "./TemperatureLineGraph.css";
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
  margin: 5px auto;
  display: flex;
  flex-direction: row;
`;

const GreenTab = styled.div`
  margin: 5px;
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

const MemoizedLineChart = React.memo(LineChart);
const MemoizedChartLegend = React.memo(ChartLegend);

const TemperatureLineChart = ({
  graphId,
  graphTab,
  num_bms,
  selectedBmsIndex,
}) => {
  const currentBMS = useSelector((state) => state.graphActiveBMSIndex);
  const temp = useSelector((state) => state.temp);
  const currentPlayOrPause = useSelector((state) => state.graphPlayPause);
  const TempChartData = useSelector((state) => state.tempChartData);

  const [activeBMS, setActiveBMS] = useState(
    currentBMS.filter(
      (bmsIndex) => bmsIndex.id === graphId + "_" + graphTab
    )[0] || {
      id: graphId + "_" + graphTab,
      bms: selectedBmsIndex,
    }
  );

  const [ChartData, setChartData] = useState(
    TempChartData.filter((chartData) => chartData.id === graphId)[0] || {
      id: graphId,
      data: {},
    }
  );

  // play or pause button click

  const [playPause, setPlayPause] = useState(
    currentPlayOrPause.filter(
      (playbtn) => playbtn.id === graphId + "_" + graphTab
    )[0] || {
      id: graphId + "_" + graphTab,
      btn: true,
    }
  );

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
  // console.log("chartData: " + ChartData);
  useEffect(() => {
    setChartData((prevData) => {
      // console.log("prevdata", prevData);
      // console.log("prevdataId", prevData.id);
      // console.log("prevdata data", prevData.data);
      const updatedData = _.cloneDeep(prevData.data);
      // const currentDataIndex = temp[`bms 0`] ? temp[`bms 0`].length - 1 : 0;
      const currentDataIndex = 0;
      if (playPause.btn) {
        if (num_bms > 0) {
          for (let j = 0; j < num_bms; j++) {
            updatedData["bms_" + j] = [];
            if (Object.keys(temp).length !== 0) {
              for (let i = currentDataIndex; i < temp["bms " + j].length; i++) {
                for (let k = 0; k < temp["bms " + j][0].length; k++) {
                  //length of all volatges coming in series will be same as number are voltages are fixed
                  if (temp["bms " + j][i][k] !== undefined) {
                    if (k < updatedData["bms_" + j].length) {
                      updatedData["bms_" + j][k].data.push(
                        temp["bms " + j][i][k]
                      );
                    } else {
                      updatedData["bms_" + j].push({
                        name: "T_" + (k + 1),
                        data: [],
                        visible: prevData.data["bms_" + j]
                          ? prevData.data["bms_" + j][k].visible
                          : true,
                      });
                      updatedData["bms_" + j][k].data.push(
                        temp["bms " + j][i][k]
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
      }

      // console.log("updated data: " + updatedData);
      return { id: graphId, data: updatedData };
    });
  }, [temp]);

  useEffect(() => {
    dispatch(dataAction.setTempChartData(ChartData));
  }, [ChartData]);

  const toggleSeriesVisibility = (seriesIndex) => {
    setChartData((prevData) => {
      const updatedData = _.cloneDeep(prevData);
      updatedData.data[`bms_${activeBMS.bms}`][seriesIndex].visible =
        !updatedData.data[`bms_${activeBMS.bms}`][seriesIndex].visible;
      return updatedData;
    });
  };

  const togglePlayPause = () => {
    setPlayPause({
      id: graphId + "_" + graphTab,
      btn: !playPause.btn,
    });
  };

  useEffect(() => {
    dispatch(
      dataAction.setGraphPlayPause({
        id: graphId + "_" + graphTab,
        btn: playPause.btn,
      })
    );
  }, [playPause]);

  useEffect(() => {
    dispatch(
      dataAction.setGraphActiveBMSIndex({
        id: graphId + "_" + graphTab,
        bms: activeBMS.bms,
      })
    );
  }, [activeBMS]);

  useEffect(() => {
    return () => {
      dispatch(
        dataAction.setGraphActiveBMSIndex({
          id: graphId + "_" + graphTab,
          bms: null,
        })
      );
      dispatch(
        dataAction.setGraphPlayPause({
          id: graphId + "_" + graphTab,
          btn: null,
        })
      );
    };
  }, []);
  // console.log("Active BMS: in ", graphId, currentBMS);
  // console.log("Active playPause: in ", playPause.btn);
  // console.log("chart data", ChartData);
  return (
    <Container>
      <Container>
        <TabContainer>
          <GreenTab
            onClick={togglePlayPause}
            className={`${!playPause.btn ? "play-btn" : "pause-btn"}`}
          >
            {playPause.btn ? "Pause" : "Play"}
          </GreenTab>
        </TabContainer>
        <TabContainer>
          {bms_buttons.map((button) => (
            <GreenTab
              key={button}
              className={`${
                button === activeBMS.bms
                  ? "bms-button-active"
                  : "bms-button-inactive"
              }`}
              onClick={() =>
                setActiveBMS({ id: graphId + "_" + graphTab, bms: button })
              }
            >
              BMS{button}
            </GreenTab>
          ))}
        </TabContainer>
      </Container>
      <Container>
        <MemoizedLineChart
          data={
            ChartData.data[`bms_${activeBMS.bms}`]
              ? ChartData.data[`bms_${activeBMS.bms}`]
              : []
          }
        />
        <MemoizedChartLegend
          data={
            ChartData.data[`bms_${activeBMS.bms}`]
              ? ChartData.data[`bms_${activeBMS.bms}`]
              : []
          }
          onLegendItemClick={toggleSeriesVisibility}
        />
      </Container>
    </Container>
  );
};

export default TemperatureLineChart;
