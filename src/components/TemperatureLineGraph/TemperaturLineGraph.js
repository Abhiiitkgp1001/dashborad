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
  padding: 10px auto;
`;

const MemoizedLineChart = React.memo(LineChart);
const MemoizedChartLegend = React.memo(ChartLegend);

const TemperatureLineChart = ({
  chartData,
  graphId,
  graphTab,
  num_bms,
  selectedBmsIndex,
  playPause,
  togglePlayPause,
  toggleSeriesVisibility,
}) => {
  const currentBMS = useSelector((state) => state.graphActiveBMSIndex);
  const [activeBMS, setActiveBMS] = useState(
    currentBMS.filter(
      (bmsIndex) => bmsIndex.id === graphId + "_" + graphTab
    )[0] || {
      id: graphId + "_" + graphTab,
      bms: selectedBmsIndex,
    }
  );

  const [ChartData, setChartData] = useState(chartData);

  const dispatch = useDispatch();
  const bms_buttons = Array.from(
    { length: num_bms - 0 },
    (_, index) => 0 + index
  );

  useEffect(() => {
    setChartData(chartData);
  }, [chartData]);

  useEffect(() => {
    dispatch(
      dataAction.setGraphActiveBMSIndex({
        id: graphId + "_" + graphTab,
        bms: activeBMS.bms,
      })
    );
  }, [activeBMS]);

  return (
    <Container>
      <div className={`menu-bar }`}>
        <div
          className={`${!playPause.btn ? "play-btn" : "pause-btn"}`}
          onClick={togglePlayPause}
        >
          {playPause.btn ? "Pause" : "Play"}
        </div>

        <div className="tabs">
          {bms_buttons.map((button) => (
            <div
              key={button}
              className={` tab ${
                button === activeBMS.bms ? "active" : "inactive"
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
      {/* <FullScreen handle={handle}> */}
      {/* <div> */}
      <MemoizedLineChart
        data={
          ChartData[`bms_${activeBMS.bms}`]
            ? ChartData[`bms_${activeBMS.bms}`]
            : []
        }
      />
      <MemoizedChartLegend
        data={
          ChartData[`bms_${activeBMS.bms}`]
            ? ChartData[`bms_${activeBMS.bms}`]
            : []
        }
        activeBMS={activeBMS}
        graphType={graphTab}
        onLegendItemClick={toggleSeriesVisibility}
      />
      {/* </div> */}
      {/* </FullScreen> */}
    </Container>
  );
};

export default TemperatureLineChart;
