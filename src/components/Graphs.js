import React, { useState } from "react";
import styled from "styled-components";
import CurrentLineChart from "./CurrentLineChart";
import TempLineChart from "./TemperatureLineChart";
import VoltageLineChart from "./VoltageLineChart";

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

const VTIGraph = () => {
  const [activeTab, setActiveTab] = useState(1);

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
              <VoltageLineChart selectedBmsIndex={0} />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <TempLineChart selectedBmsIndex={0} />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <CurrentLineChart selectedBmsIndex={0} />
            </div>
          )}
        </TabContent>
      </TabContainer>
    </TabWraper>
  );
};

export default VTIGraph;
