import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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
  padding: 10px auto;
`;

const MemoizedLineChart = React.memo(LineChart);
const MemoizedChartLegend = React.memo(ChartLegend);

const TemperatureLineChart = ({
  graphId,
  graphTab,
  num_bms,
  selectedBmsIndex,
  binStatus
}) => {
  const time = useSelector((state) => state.timestamp);
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
      const updatedData = _.cloneDeep(prevData.data);
      const currentDataIndex = 0;
      if (playPause.btn) {
        if (num_bms > 0) {
          for (let j = 0; j < num_bms; j++) {
            updatedData["bms_" + j] = [];
            if (Object.keys(temp).length !== 0) {
              const filteredTempData = filterDataByBinStatus(
                temp["bms " + j],
                binStatus
              );
              const filteredTimeData = filterDataByBinStatus(
                time,
                binStatus
              );
              for (let i = currentDataIndex; i < filteredTempData.length; i++) {
                for (let k = 0; k < filteredTempData[0].length; k++) {
                  if (filteredTempData[i][k] !== undefined) {
                    if (k < updatedData["bms_" + j].length) {
                      updatedData["bms_" + j][k].data.push({
                        x: filteredTimeData[i],
                        y: filteredTempData[i][k],
                      });
                    } else {
                      updatedData["bms_" + j].push({
                        name: "T_" + (k + 1),
                        data: [],
                        visible: prevData.data["bms_" + j]
                          ? prevData.data["bms_" + j][k].visible
                          : true,
                      });
                      updatedData["bms_" + j][k].data.push({
                        x: filteredTimeData[i],
                        y: filteredTempData[i][k],
                      });
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
      return { id: graphId, data: updatedData };
    });
  }, [temp, time, binStatus]);

  const filterDataByBinStatus = (data, status) => {
    switch (status) {
      case "last30s":
        return data.slice(-6);
      case "last60s":
        return data.slice(-12);
      case "last5min":
        return data.slice(-60);
      case "all":
      default:
        return data;
    }
  };


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

  // useEffect(() => {
  //   return () => {
  //     dispatch(
  //       dataAction.setGraphActiveBMSIndex({
  //         id: graphId + "_" + graphTab,
  //         bms: null,
  //       })
  //     );
  //     dispatch(
  //       dataAction.setGraphPlayPause({
  //         id: graphId + "_" + graphTab,
  //         btn: null,
  //       })
  //     );
  //   };
  // }, []);
  // console.log("Active BMS: in ", graphId, currentBMS);
  // console.log("Active playPause: in ", playPause.btn);
  // console.log("chart data", ChartData);

  //full screen logic
  const handle = useFullScreenHandle();
  // console.log("handle ", handle);

  return (
    <Container>
      <div className={`menu-bar }`}>
        <div
          className={`${!playPause.btn ? "play-btn" : "pause-btn"}`}
          onClick={togglePlayPause}
        >
          {playPause.btn ? "Pause" : "Play"}
        </div>
        <div className="tab" onClick={handle.enter}>
          Go Fullscreen
        </div>
        <div className="tabs">
          {bms_buttons.map((button) => (
            <div
              key={button}
              className={` tab ${button === activeBMS.bms ? "active" : "inactive"
                }`}
              onClick={() =>
                setActiveBMS({ id: graphId + "_" + graphTab, bms: button })
              }
            >
              BMS{button}
            </div>
          ))}
        </div>
      </div>
      <FullScreen handle={handle}>
        <div>
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
        </div>
      </FullScreen>
    </Container>
  );
};

export default TemperatureLineChart;
