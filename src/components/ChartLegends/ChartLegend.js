import React from "react";
import styled from "styled-components";
import "./ChartLegends.css";

const LegendContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
`;
function ChartLegend({ data, onLegendItemClick }) {
  return (
    <LegendContainer>
      {data.map((series, index) => (
        <div
          key={index}
          className={`legend-item  ${!series.visible ? "legend-inactive" : ""}`}
          onClick={() => onLegendItemClick(index)}
        >
          <span className={`legend-marker color-${index}`} />
          <span className="legend-text">{series.name}</span>
        </div>
      ))}
    </LegendContainer>
  );
}

export default ChartLegend;
