import React, { useEffect, useState } from "react";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dataAction } from "../../store";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import ChartLegend from "../ChartLegends/ChartLegend";
import LineChart from "../LineChart";
import "./currentLineGraph.css";
const _ = require("lodash");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px auto;
`;
const MenuContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  background-color: #EEE2DE;
  border-radius: 6px;
  font-family: Poppins;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 12px;
`;
const IconContainer = styled.div`
  padding: 4px;
  border-radius: 40px;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  display: flex;
  &:hover {
    opacity : 0.75;
  }
`;
const MemoizedLineChart = React.memo(LineChart);
const MemoizedChartLegend = React.memo(ChartLegend);

const CurrentLineChart = ({
  chartData,
  graphId,
  graphTab,
  num_bms,
  selectedBmsIndex,
  playPause,
  togglePlayPause,
  isInFullScreen,
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
      <MenuContainer>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
          <div
            onClick={togglePlayPause}
          >
            {playPause.btn ? <IconContainer>
              <FaCirclePause />
            </IconContainer> : <IconContainer> <FaCirclePlay /></IconContainer>}
          </div>
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
      </MenuContainer>
      <MemoizedLineChart
        data={
          ChartData[`bms_${activeBMS.bms}`]
            ? ChartData[`bms_${activeBMS.bms}`]
            : []
        }
        isInFullScreen={isInFullScreen}
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

export default CurrentLineChart;
