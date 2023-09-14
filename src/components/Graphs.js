import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import TempLineChart from "./TemperaturLineGraph";
import VoltageLineChart from "./VoltageLineGraph";
import CurrentLineChart from "./currentLineGraph";

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
  border: 1px solid #ccc;
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
const BMsSelectButtoneader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const VTIGraph = () => {
  const [activeTab, setActiveTab] = useState(1);
  const num_bms = useSelector((state) => state.bms);
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const activeStyle = {
    color: "#fff",
  };

  return (
    <TabWraper>
      <TabContainer className="tab-container">
        <TabNavigation>
          <Tab
            className={`tab ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleTabClick(1)}
          >
            Voltage
          </Tab>
          <Tab
            className={`tab ${activeTab === 2 ? "active" : ""}`}
            onClick={() => handleTabClick(2)}
          >
            Temperature
          </Tab>
          <Tab
            className={`tab ${activeTab === 3 ? "active" : ""}`}
            onClick={() => handleTabClick(3)}
          >
            Current
          </Tab>
        </TabNavigation>

        <TabContent className="tab-content">
          {activeTab === 1 && (
            <div>
              <VoltageLineChart num_bms={num_bms} selectedBmsIndex={0} />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <TempLineChart num_bms={num_bms} selectedBmsIndex={0} />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <CurrentLineChart num_bms={num_bms} selectedBmsIndex={0} />
            </div>
          )}
        </TabContent>
      </TabContainer>
    </TabWraper>
  );
};

export default VTIGraph;
