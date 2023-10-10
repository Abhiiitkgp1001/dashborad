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
  const graphActiveTab = useSelector((state) => state.graphActiveTab);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(
    graphActiveTab.filter((active) => active.id === graphId)[0] || {
      id: graphId,
      tabNumber: 1,
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
  const activeStyle = {
    color: "#fff",
  };
  console.log();
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
  const removeBtn = (
    <>
      <GreenButton onClick={onRemove}>
        <FaXmark />
         Remove
      </GreenButton>
    </>
  );
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
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                  />
                </div>
              )}
              {activeTab.tabNumber === 2 && (
                <div>
                  <TempLineChart
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                  />
                </div>
              )}
              {activeTab.tabNumber === 3 && (
                <div>
                  <CurrentLineChart
                    graphId={graphId}
                    num_bms={num_bms}
                    graphTab={activeTab.tabNumber}
                    selectedBmsIndex={0}
                    isInFullScreen={handle.active}
                  />
                </div>
              )}
            </div>
          </TabContainer>
        </div>
      </ResizableContainer>
    </FullScreen>
  );
};

export default VTIGraph;
