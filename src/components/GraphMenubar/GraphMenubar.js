import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataAction } from "../../store";

import "./GraphMenubar.css"; // Import your CSS file

const GraphMenuBar = ({ removeBtn, graphId, handle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const graphActiveTab = useSelector((state) => state.graphActiveTab);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(
    graphActiveTab.filter((active) => active.id === graphId)[0] || {
      id: graphId,
      tabNumber: 1,
    }
  );
  const handleTabClick = (tabNumber) => {
    dispatch(
      dataAction.setGraphActiveTab({
        id: graphId,
        tabNumber: tabNumber,
      })
    );
  };

  useEffect(() => {
    setActiveTab(
      graphActiveTab.filter((active) => active.id === graphId)[0] || {
        id: graphId,
        tabNumber: 1,
      }
    );
  }, [graphActiveTab]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`menu-bar ${menuOpen ? "open" : ""}`}>
      <div className="menu-button" onClick={toggleMenu}>
        {removeBtn}
      </div>
      <div className="tab" onClick={handle.active ? handle.exit : handle.enter}>
        {handle.active ? "Exit FullScreen" : "Go Fullscreen"}
      </div>
      <div className="tabs">
        <div
          className={`tab ${activeTab.tabNumber === 1 ? "active" : "inactive"}`}
          onClick={() => handleTabClick(1)}
        >
          Voltage
        </div>
        <div
          className={`tab ${activeTab.tabNumber === 2 ? "active" : "inactive"}`}
          onClick={() => handleTabClick(2)}
        >
          Temperature
        </div>
        <div
          className={`tab ${activeTab.tabNumber === 3 ? "active" : "inactive"}`}
          onClick={() => handleTabClick(3)}
        >
          current
        </div>
      </div>
    </div>
  );
};

export default GraphMenuBar;
