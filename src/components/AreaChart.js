import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import styled from 'styled-components'
import { mean, median, mode, standardDeviation } from '../helpers/utils';
import SmallOne from './smallOne';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding : 28px 24px;    
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;


const LegendContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 72px;
  gap:12px;
  overflow-x : scroll;
  width: 100%;

`;


const FeatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding : 8px 16px;
    height: 36px;
    min-width: 32px;
    align-items: center;
    justify-content: center;
    border-radius : 40px;
    cursor: pointer;
    font-family: Poppins;
    font-weight: 600;
    background-color: #A1CCD1;
    font-size:12px;
    &:hover{
        opacity: 0.65;
      }
`;
const RedButton = styled.div`
margin-top: auto;
margin-left: 8px;
display: flex;
padding: 8px 16px;
background-color: #A73121;
border-radius: 6px;
color: #C9F7F5;
opacity: 0.65;
cursor:pointer;
font-family: Poppins;
font-size: 12px;
justify-content: center;
align-items: center;
font-weight : 700;
&:hover{
  opacity: 1;
}
`;
var filtered_data ={};
var chart_options =  {    
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 5,
  },
  xaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    tickAmount: 4,
    floating: false,
  
    labels: {
      style: {
        colors: '#8e8da4',
      },
      offsetY: -7,
      offsetX: 0,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false
    }
  },
  fill: {
    opacity: 0.5
  },
  tooltip: {
    x: {
      format: "yyyy",
    },
    fixed: {
      enabled: false,
      position: 'topRight'
    }
  },
  legend:{
      show:false,
  },
  grid: {
    yaxis: {
      lines: {
        offsetX: -30
      }
    },
    padding: {
      left: 20
    }
  },
  
};
const AreaChart = (props) => {
  const [data_mean, setDataMean] = useState([]);
  const [data_median, setDataMedian] = useState([]);
  const [data_std, setDataStd] = useState([]);
  const [chartData, setChartData] = useState({
    series : [],
    options: chart_options
  });

  useEffect(() => {
      var filted_data_via_legends = [];
    for(let i in props.data.legend){
      if(props.data.legend[i].visible==true){
        filted_data_via_legends.push({
          name: props.data.legend[i].name,
          data: props.data.data[props.data.legend[i].name]
        });
      }
    }
    
     let new_chart_data = {
            series: filted_data_via_legends,
            options: chart_options,
        }
    setChartData(new_chart_data);
    console.log(filted_data_via_legends);
  }, [props.changeLegendVisiblity])
  


  return (
   
      
      <Container>
        
        <Header>
          <div/>
          <RedButton onClick={()=>{
            props.removeGraph(props.index);
          }}>Delete Graph</RedButton>
          </Header>  
          <Chart
            id={props.id}
            options={chartData.options}
            series={chartData.series}
            type="line"
            height='360px'
          />
          <LegendContainer>
          {
            Object.keys(props.data.legend).map((item,index)=>{
            return <FeatureContainer style={{
              backgroundColor: props.data.legend[item].visible ?'#7A9D54' : '#A1CCD1',
              color: props.data.legend[item].visible ?'white':'black',
            }}
            onClick={()=>{
              props.changeLegendVisiblity(item,props.index)
            }}
            >{props.data.legend[item].name}</FeatureContainer>})
          }
          </LegendContainer>
          
      </Container>
  );
};

export default AreaChart
