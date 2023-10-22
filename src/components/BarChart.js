import styled from 'styled-components'
import Chart from "react-apexcharts";
import React, { useState, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BsFullscreen} from "react-icons/bs";
const Container = styled.div`
    display: flex;
    flex-direction: column;
`;
const SizedBox = styled.div`
    display: flex;
    flex-direction: column;
    height:8px;  
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WhiteContainer = styled.div`
    display: flex;
    flex-direction: column; 
    background-color : white;  
`;
const LegendContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 72px;
  gap:12px;
  overflow-x : scroll;
  width: 100%;

`;
const RedButton = styled.div`
margin-top: auto;
margin-left: 8px;
display: flex;
padding: 8px;
background-color: #A73121;
border-radius: 40px;
color: #C9F7F5;
opacity: 0.65;
cursor:pointer;
font-family: Poppins;
font-size: 12px;
font-weight: 700;
justify-content: center;
align-items: center;
font-weight : 700;
&:hover{
  opacity: 1;
}
`;

const FeatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding : 2px 10px;
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
var chart_options ={
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          borderRadius: 6,
          borderRadiusApplication:'end'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
};
const BarChart = (props) => {
    const graphFullScreen = useFullScreenHandle();
    const [chartData, setChartData] = useState({
        series : [],
        options: chart_options
      });
    useEffect(() => {
        console.log(props.data);
        var filted_data_via_legends = [];
        var mean_data = [];
        for(let i in props.data.mean){
          if(props.data.legend[props.data.mean[i].name].visible==true){
            mean_data.push({
                x:props.data.mean[i].name,
                y:props.data.mean[i].value
            });
          }
        }
        filted_data_via_legends.push({
            name: "Mean",
            data: mean_data
        })
        var median_data = [];
        for(let i in props.data.median){
          if(props.data.legend[props.data.median[i].name].visible==true){
            median_data.push({
                x:props.data.median[i].name,
                y:props.data.median[i].value
            });
          }
        }
        filted_data_via_legends.push({
            name: "Median",
            data: median_data
        })
        var std_data = [];
        for(let i in props.data.std){
          if(props.data.legend[props.data.std[i].name].visible==true){
            std_data.push({
                x:props.data.std[i].name,
                y:props.data.std[i].value
            });
          }
        }
        filted_data_via_legends.push({
            name: "Standard Deviation",
            data: std_data
        });
         let new_chart_data = {
                series: filted_data_via_legends,
                options: chart_options,
            }
        setChartData(new_chart_data);
    }, [props.bms_active, props.changeLegendVisiblityBarGraph])
    
  return (
    <Container>
        <Header>
            <div></div>
          <RedButton style={{
            backgroundColor: '#000'            
          }} onClick={graphFullScreen.enter}><BsFullscreen/></RedButton>
        </Header>
        <SizedBox/>
        <SizedBox/>
        <FullScreen  handle={graphFullScreen}>
          <WhiteContainer style={
            {
              height:graphFullScreen.active?'100%':'450px',
              padding: graphFullScreen.active? '20px 24px':'0px'
            }
            }>
            <Chart options={chartData.options} series={chartData.series} type="bar" height={graphFullScreen.active?'90%':'360px'} />
            {graphFullScreen.active && <SizedBox/> }
            <LegendContainer className='noscroll'>
            {
                Object.keys(props.data.legend).map((item,index)=>{
                return <FeatureContainer style={{
                backgroundColor: props.data.legend[item].visible ?'#7A9D54' : '#A1CCD1',
                color: props.data.legend[item].visible ?'white':'black',
                }}
                key={index}
                onClick={()=>{
                props.changeLegendVisiblityBarGraph(item);
                }}
                >{props.data.legend[item].name}</FeatureContainer>})
            }
            </LegendContainer>
          </WhiteContainer>
        </FullScreen> 
          
    </Container>
  )
}

export default BarChart