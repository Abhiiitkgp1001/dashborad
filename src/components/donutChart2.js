import React from 'react'
import styled, {keyframes} from 'styled-components'


const DonutChart2 = ({percentage,color,title }) => {
const growAnimation = keyframes`
0% {
    stroke-dashoffset: 500;
}`;

const PercentageText = styled.text`
font-family: Poppins;
font-style: normal;
font-weight: 600;
font-size: 20px;
`;

const RiskText = styled.tspan`
font-family: Poppins;
font-style: normal;
font-weight: 500;
font-size: 12px;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 28px 30px;
  align-items : center;
  box-shadow: 0px 0px 20px rgba(94, 98, 120, 0.04);
  border-radius : 12px;
`;


const Text1 = styled.div`
font-family: 'Poppins';
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 21px;
color: #B5B5C3;
margin-bottom : 12px;
`;

const CustomSVG = styled.svg`
display: block;
width: 180px;
height: 180px;
transform-origin: center;
transform: rotate(-0.5turn);
`;
const CustomCircle = styled.circle`
  fill: transparent;
  stroke: ${color};
  stroke-width: 20;
  cx: 50%;
  cy: 50%;
  r: 80px;
  stroke-dasharray: 502.654824574;
  transform-origin: center;
  stroke-dashoffset: calc(502.654824574px * (1 - ${percentage} / 200));
  stroke-linecap: round;
  animation-delay: calc(2 * 10ms);
  animation-name: ${growAnimation};
  animation-duration: calc(${percentage} * 10ms);
  animation-timing-function: linear;
  animation-fill-mode: both;
  
`;
const CustomCircle2 = styled.circle`
  fill: transparent;
  stroke: #DDD;
  stroke-width: 20;
  cx: 50%;
  cy: 50%;
  r: 80px;
  stroke-dasharray: 502.654824574;
  transform-origin: center;
  stroke-dashoffset: calc(502.654824574px * 0.5);
  stroke-linecap: round;  
`;

const Container = styled.div`
  height: 282px;
  width: 264px;
`;


  return (
    <Container>
      <GraphContainer>
      <Text1 >{title}</Text1>
      <CustomSVG >
        <CustomCircle2 />
        <CustomCircle /> 
        <PercentageText  x=  { percentage<10 ?"-58.5%" :"-61.5%"} y="-56%" fill='#3F4254' transform="rotate(180)">{percentage<10 ? `${percentage} %` :   `${percentage} %`}
          <RiskText x="-70%" y="-46%" fill='#B5B5C3' transform="rotate(180)">Contribution</RiskText>
        </PercentageText>
      </CustomSVG>
      
    </GraphContainer>
    </Container>
    
  )
}

export default DonutChart2