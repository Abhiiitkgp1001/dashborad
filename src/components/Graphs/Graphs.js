import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useDispatch, useSelector } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import styled from "styled-components";
import { dataAction } from "../../store";
import CurrentLineChart from "../CurrentLineGraph/currentLineGraph";
import GraphMenuBar from "../GraphMenubar/GraphMenubar";
import ResizableContainer from "../ResizableContainer/ResizeableContainer";
import TempLineChart from "../TemperatureLineGraph/TemperaturLineGraph";
import VoltageLineChart from "../VoltageLineGraph/VoltageLineGraph";
import "./Graphs.css";
const _ = require("lodash");

const TabContainer = styled.div`
  border: 1px solid #ccc;
  margin: auto;
  width: 100%;
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin: 5px;
  width: fit-content;
  text-align: center;
  cursor: pointer;
  background-color: #c9f7f5;
`;
const RemoveButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: 1px 1px 1px 0px solid #ccc;
  margin: auto;
  padding: 10px;
  width: 80%;
`;
const TabNavigation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  border: 5px solid #0000;
`;
const TabContent = styled.div`
  margin: 20px;
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

const VTIGraph = ({ graphId, componentKey, onRemove }) => {
  const time = useSelector((state) => state.timestamp); //timestamp
  const voltage = useSelector((state) => state.voltage); //voltage
  const current = useSelector((state) => state.current); //current
  const temp = useSelector((state) => state.temp); // temperature
  const chart = useSelector((state) => state.chartData); // chart data
  const currentPlayOrPause = useSelector((state) => state.graphPlayPause); //playpause button

  const graphActiveTab = useSelector((state) => state.graphActiveTab); // active graph tab
  const [playPause, setPlayPause] = useState(
    currentPlayOrPause.filter((playbtn) => playbtn.id === graphId)[0] || {
      id: graphId,
      btn: true,
    }
  );
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(
    graphActiveTab.filter((active) => active.id === graphId)[0] || {
      id: graphId,
      tabNumber: 1,
    }
  );

  const [ChartData, setChartData] = useState(
    chart.filter((chart) => chart.id === graphId)[0] || {
      id: graphId,
      data: {
        voltageData: {},
        tempData: {},
        currentData: {},
      },
    }
  );

  useEffect(() => {
    setActiveTab(
      graphActiveTab.filter((active) => active.id === graphId)[0] || {
        id: graphId,
        tabNumber: 1,
      }
    );
  }, [graphActiveTab]);
  const num_bms = useSelector((state) => state.bms);
  const graphWidth = "100%";
  const graphHeight = "100%";

  const [binStatus, setBinStatus] = useState('all');
  const handleTabClick = (tab) => {
    setBinStatus(tab);
  };
  //for updating chart data
  useEffect(() => {
    setChartData((prevData) => {
      const updatedData = _.cloneDeep(prevData.data);
      if (playPause.btn) {
        if (num_bms > 0) {
          for (let j = 0; j < num_bms; j++) {
            var start = 0, end = voltage["bms " + j].length;
            if (binStatus == 'last30s') {
              start = Math.max(0, end - 10);
            }
            else if (binStatus == 'last60s') {
              start = Math.max(0, end - 20);
            }
            else if (binStatus == 'last5min') {
              start = Math.max(0, end - 100);
            }
            // console.log(start, end);
            updatedData.voltageData["bms_" + j] = [];
            updatedData.tempData["bms_" + j] = [];
            updatedData.currentData["bms_" + j] = [];
            if (Object.keys(voltage).length !== 0) {
              for (let i = start; i < end; i++) {
                //set current data as its index contains only single values
                if (updatedData.currentData["bms_" + j].length > 0) {
                  updatedData.currentData["bms_" + j][0].data.push({
                    x: time[i],
                    y: current[i],
                  });
                } else {
                  updatedData.currentData["bms_" + j].push({
                    name: "C",
                    data: [],
                    visible: prevData.data.currentData["bms_" + j]
                      ? prevData.data.currentData["bms_" + j][0].visible
                      : true,
                  });
                }
                for (let k = 0; k < voltage["bms " + j][0].length; k++) {
                  //length of all volatges coming in series will be same as number are voltages are fixed
                  if (voltage["bms " + j][i][k] !== undefined) {
                    if (k < updatedData.voltageData["bms_" + j].length) {
                      updatedData.voltageData["bms_" + j][k].data.push({
                        x: time[i],
                        y: voltage["bms " + j][i][k],
                      });
                    } else {
                      updatedData.voltageData["bms_" + j].push({
                        name: "V_" + (k + 1),
                        data: [],
                        visible: prevData.data.voltageData["bms_" + j]
                          ? prevData.data.voltageData["bms_" + j][k].visible
                          : true,
                      });
                      updatedData.voltageData["bms_" + j][k].data.push({
                        x: time[i],
                        y: voltage["bms " + j][i][k],
                      });
                    }
                  } else {
                    break;
                  }
                }
                for (let k = 0; k < temp["bms " + j][0].length; k++) {
                  //length of all volatges coming in series will be same as number are voltages are fixed
                  if (temp["bms " + j][i][k] !== undefined) {
                    if (k < updatedData.tempData["bms_" + j].length) {
                      updatedData.tempData["bms_" + j][k].data.push({
                        x: time[i],
                        y: temp["bms " + j][i][k],
                      });
                    } else {
                      updatedData.tempData["bms_" + j].push({
                        name: "T_" + (k + 1),
                        data: [],
                        visible: prevData.data.tempData["bms_" + j]
                          ? prevData.data.tempData["bms_" + j][k].visible
                          : true,
                      });
                      updatedData.tempData["bms_" + j][k].data.push({
                        x: time[i],
                        y: temp["bms " + j][i][k],
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
  }, [voltage, temp, current, time, binStatus]);

  useEffect(() => {
    dispatch(dataAction.setChartData(ChartData));
  }, [ChartData]);

  const toggleSeriesVisibility = (seriesIndex, activeBMS, graphType) => {
    setChartData((prevData) => {
      const updatedData = _.cloneDeep(prevData);
      if (graphType === 1) {
        updatedData.data.voltageData[`bms_${activeBMS.bms}`][
          seriesIndex
        ].visible =
          !updatedData.data.voltageData[`bms_${activeBMS.bms}`][seriesIndex]
            .visible;
      }
      if (graphType === 2) {
        updatedData.data.tempData[`bms_${activeBMS.bms}`][seriesIndex].visible =
          !updatedData.data.tempData[`bms_${activeBMS.bms}`][seriesIndex]
            .visible;
      }
      if (graphType === 3) {
        updatedData.data.currentData[`bms_${activeBMS.bms}`][
          seriesIndex
        ].visible =
          !updatedData.data.currentData[`bms_${activeBMS.bms}`][seriesIndex]
            .visible;
      }
      return updatedData;
    });
  };

  // console.log(ChartData.data.currentData);
  // console.log(ChartData.data.voltageData);
  // console.log(ChartData.data.tempData);

  //for chnage in playpause btn set data in store if rerender happens it takes that into account
  useEffect(() => {
    dispatch(
      dataAction.setGraphPlayPause({
        id: graphId,
        btn: playPause.btn,
      })
    );
  }, [playPause]);
  // // console.log("GraphId", graphId);
  // console.log("ActiveTab in graph", graphId, graphActiveTab);
  useEffect(() => {
    return () => {
      // dispatch(
      //   dataAction.setGraphActiveTab({
      //     id: graphId,
      //     tabNumber: null,
      //   })
      // );
      dispatch(
        dataAction.setGraphActiveBMSIndex({
          id: graphId + "_" + activeTab.tabNumber,
          bms: null,
        })
      );
    };
  }, []);
  const togglePlayPause = () => {
    setPlayPause({
      id: graphId,
      btn: !playPause.btn,
    });
  };
  const removeBtn = <GreenButton onClick={onRemove}><FaXmark /></GreenButton>;
  //full screen logic
  const handle = useFullScreenHandle();
  console.log("handle:  ", handle.active);
  return (
    <FullScreen handle={handle}>
      <ResizableContainer height={graphHeight} width={graphWidth}>
        <div>
          <GraphMenuBar
            removeBtn={removeBtn}
            graphId={graphId}
            handle={handle}
          />

          <TabContainer className="tab-container">
            <div
              className="tab-content"
              style={
                {margin:"20px"}
              }
            >
              {activeTab.tabNumber === 1 && (
                <div>
                  <VoltageLineChart
                    chartData={ChartData.data.voltageData}
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                    playPause={playPause}
                    togglePlayPause={togglePlayPause}
                    toggleSeriesVisibility={toggleSeriesVisibility}
                  />
                </div>
              )}
              {activeTab.tabNumber === 2 && (
                <div>
                  <TempLineChart
                    chartData={ChartData.data.tempData}
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                    playPause={playPause}
                    togglePlayPause={togglePlayPause}
                    toggleSeriesVisibility={toggleSeriesVisibility}
                  />
                </div>
              )}
              {activeTab.tabNumber === 3 && (
                <div>
                  <CurrentLineChart
                    chartData={ChartData.data.currentData}
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                    playPause={playPause}
                    togglePlayPause={togglePlayPause}
                    toggleSeriesVisibility={toggleSeriesVisibility}
                  />
                </div>
              )}
            </div>
          </TabContainer>
          {/*  */}
          <div className="menu-bar">
            <div className="tabs">
              <div
                className={`tab ${binStatus === 'last30s' ? 'active' : 'inactive'}`}
                onClick={() => handleTabClick('last30s')}
              >
                Last 30s
              </div>
              <div
                className={`tab ${binStatus === 'last60s' ? 'active' : 'inactive'}`}
                onClick={() => handleTabClick('last60s')}
              >
                Last 60s
              </div>
              <div
                className={`tab ${binStatus === 'last5min' ? 'active' : 'inactive'}`}
                onClick={() => handleTabClick('last5min')}
              >
                Last 5min
              </div>
              <div
                className={`tab ${binStatus === 'all' ? 'active' : 'inactive'}`}
                onClick={() => handleTabClick('all')}
              >
                All
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </ResizableContainer>
    </FullScreen>
  );
};

export default VTIGraph;
