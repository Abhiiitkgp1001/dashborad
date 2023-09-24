import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { dataAction } from "../../store";
import CurrentLineChart from "../CurrentLineGraph/currentLineGraph";
import TempLineChart from "../TemperatureLineGraph/TemperaturLineGraph";
import VoltageLineChart from "../VoltageLineGraph/VoltageLineGraph";
import "./Graphs.css";
const TabWraper = styled.div``;

const TabContainer = styled.div`
  border: 1px solid #ccc;
  margin: auto;
  width: 80vw;
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin: 5px;
  width: fit-content;
  text-align: center;
  cursor: pointer;
  background-color: #c9f7f5;
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
const RemoveButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: 1px 1px 1px 0px solid #ccc;
  margin: auto;
  padding: 10px;
  width: 80vw;
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
  const num_bms = useSelector((state) => state.bms);
  const handleTabClick = (tabNumber) => {
    setActiveTab({ id: graphId, tabNumber: tabNumber });
  };

  useEffect(() => {
    dispatch(
      dataAction.setGraphActiveTab({
        id: graphId,
        tabNumber: activeTab.tabNumber,
      })
    );
  }, [activeTab]);

  const activeStyle = {
    color: "#fff",
  };
  // // console.log("GraphId", graphId);
  // console.log("ActiveTab in graph", graphId, graphActiveTab);
  useEffect(() => {
    return () => {
      dispatch(
        dataAction.setGraphActiveTab({
          id: graphId,
          tabNumber: null,
        })
      );
      dispatch(
        dataAction.setGraphActiveBMSIndex({
          id: graphId + "_" + activeTab.tabNumber,
          bms: null,
        })
      );
    };
  }, []);
  return (
    <TabWraper>
      <TabContainer className="tab-container">
        <RemoveButtonContainer>
          <GreenButton onClick={onRemove}> Remove</GreenButton>
        </RemoveButtonContainer>
        <TabNavigation>
          <Tab
            className={`tab ${
              activeTab.tabNumber === 1 ? "active" : "inactive"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Voltage
          </Tab>
          <Tab
            className={`tab ${
              activeTab.tabNumber === 2 ? "active" : "inactive"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Temperature
          </Tab>
          <Tab
            className={`tab ${
              activeTab.tabNumber === 3 ? "active" : "inactive"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Current
          </Tab>
        </TabNavigation>

        <TabContent className="tab-content">
          {activeTab.tabNumber === 1 && (
            <div>
              <VoltageLineChart
                graphId={graphId}
                num_bms={num_bms}
                graphTab={activeTab.tabNumber}
                selectedBmsIndex={0}
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
              />
            </div>
          )}
        </TabContent>
      </TabContainer>
    </TabWraper>
  );
};

export default VTIGraph;
