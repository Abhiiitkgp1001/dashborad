import React, { useState } from 'react'
import styled from 'styled-components'
import Heading from '../components/heading';
import Papa from "papaparse";
import { read, utils, writeFile } from 'xlsx';
import AreaChart from '../components/AreaChart';
import { mean, median, standardDeviation } from '../helpers/utils';
import SmallOne from '../components/smallOne';
const colors = ['#272829','#435334','#2E3840'];
const max = 2;
const min = 0;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding : 28px 24px;    
`;
const GreenButton = styled.div`
margin-top: auto;
margin-left: 8px;
display: flex;
padding: 8px 16px;
background-color: #C9F7F5;
border-radius: 6px;
color: #1BC5BD;
cursor:pointer;
font-family: Poppins;
font-size: 12px;
justify-content: center;
align-items: center;
font-weight : 700;
&:hover{
  color: #C9F7F5;
  background-color: #1BC5BD;
}
`;
const FeatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding : 12px 20px;
    border-radius : 12px;
    cursor: pointer;
    font-family: Poppins;
    font-weight: 500;
    font-size:14px;
    &:hover{
        opacity: 0.65;
      }
  `;

const SizedBox = styled.div`
    display: flex;
    height: 32px;
`;
const SizedBox2 = styled.div`
    display: flex;
    height: 8px;
`;

const FileInput = styled.input`
&::file-selector-button {
    padding: 4px 16px;
    background-color: #282733;
    border-radius: 8px;
    cursor:pointer;
    color:white;
    font-family: Poppins;
    font-size: 14px;
    font-weight : 600;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
    margin-right: 12px;
  }
  &::file-selector-button:hover {
    background-color: #282733;
    opacity: 0.85;
  }
  
  &::file-selector-button:active {
    background-color: #282733;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap:12px;
`;
const ColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap:16px;
`;
const CalcContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  align-items: center;
  border-radius : 8px;
  font-size: 14px;
  min-width: 72px;
  font-family: Poppins;
  font-weight: 700;
  color: white;
  height: 58px;
`;
const CalcOuterContainer = styled.div`
display: flex;
flex-direction: row;
height: 80px;
gap:12px;
margin-top: 8px;
overflow-x : scroll;
width: 100%;
.noscrollbar::-webkit-scrollbar {
  display: none;
}
`;
const ImportData = () => {
    const [bms_data, setBMSData] = useState({});
    const [bms_active, setBMSActive] = useState(-1);
    const [bms_graphs, setBMSGraphs] = useState({});
    const [data_mean, setDataMean] = useState([]);
    const [data_median, setDataMedian] = useState([]);
    const [data_std, setDataStd] = useState([]);
    
    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                // console.log(sheets.length);
                if (sheets.length) {
                    var data = {};
                    var graphs = {};
                    var parsedData = {};
                    for(let i=0;i<sheets.length;i++){
                        const rows = utils.sheet_to_json(wb.Sheets[sheets[i]]);
                        // console.log(rows);
                        data[`BMS ${i}`] =rows;
                        graphs[`BMS ${i}`] =[];
                    }
                    
                    for(let key in data){
                        let filtered_data ={};
                        for(let i=0;i<data[key].length;i++){
                            let obj = data[key][i];
                            for (let j in obj) {
                                filtered_data[j] = filtered_data[j]||[]; 
                                filtered_data[j].push(obj[j]);
                            }
                        }
                        let legend = {};
                        for(let i in filtered_data){
                            legend[i] = {
                                name:i,
                                visible: false,
                            }
                        }
                        parsedData[key] = {
                            data : filtered_data,
                            legend : legend
                        }
                    }
                    // console.log(parsedData);
                    setBMSData(parsedData);
                    setBMSGraphs(graphs);

                    let overall_data_means = {};
                    let overall_data_medians = {};
                    let overall_data_stds = {};
                    for(let key in parsedData){
                        let data_means = [];
                        let data_medians = [];
                        let data_stds = [];
                        for(let i in parsedData[key].data){
                            let cur_mean = Math.round(mean([...parsedData[key].data[i]])*100)/100;
                            data_means.push({
                                name: i,
                                value : cur_mean
                            })
                            let cur_median = Math.round(median([...parsedData[key].data[i]])*100)/100;
                            data_medians.push({
                                name: i,
                                value : cur_median
                            })
                            let cur_mode = Math.round(standardDeviation([...parsedData[key].data[i]])*100)/100;
                            data_stds.push({
                                name: i,
                                value : cur_mode
                            })
                        }
                        overall_data_means[key] = data_means;
                        overall_data_medians[key] = data_medians;
                        overall_data_stds[key] = data_stds;
                    }
                    // console.log(overall_data_means);
                    // console.log(overall_data_medians);
                    // console.log(overall_data_stds);
                    setDataMean(overall_data_means);
                    setDataMedian(overall_data_medians);
                    setDataStd(overall_data_stds);
                    
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }
    const removeGraph = (index)=>{
        let remove_graph_current_selected_bms = {...bms_graphs};
        // console.log("remove graph")
        // console.log(remove_graph_current_selected_bms);
        remove_graph_current_selected_bms[`BMS ${bms_active}`].splice(index,1);
        // console.log(remove_graph_current_selected_bms);
        setBMSGraphs(remove_graph_current_selected_bms);
    }

    const changeLegendVisiblity = (item,index)=>{
        let changed_bms_graph = {...bms_graphs};
        changed_bms_graph[`BMS ${bms_active}`][index]["legend"][item].visible = !changed_bms_graph[`BMS ${bms_active}`][index]["legend"][item].visible;
        setBMSGraphs(changed_bms_graph);
    }
    const addGraphs = ()=>{
        let add_graph_current_selected_bms = {...bms_graphs};
        let new_item = JSON.parse(JSON.stringify(bms_data[`BMS ${bms_active}`]));;
        add_graph_current_selected_bms[`BMS ${bms_active}`].push(new_item)
        setBMSGraphs(add_graph_current_selected_bms);
    }
  return (
    <Container>
        <Header>
            <Heading children="Analysis Past Data"/>
            <Header>
            <FileInput
                type="file"
                name="file"
                onChange={handleImport}
                accept=".xlsx"
            />
            </Header>
        </Header>
        <SizedBox/>
        <SizedBox/>
        <Header>
            <RowContainer>
                {
                Object.keys(bms_data).map((item, index) =>{
                    return <FeatureContainer key={index} style={{
                        backgroundColor: bms_active == index ?'#7A9D54' : '#A1CCD1',
                        color:bms_active == index ?'white':'black',
                        boxShadow: bms_active == index ? 'none' : '0px 0px 20px rgba(94, 98, 120, 0.04)',
                    }} 
                    onClick={()=>setBMSActive(index)}
                    >{item}</FeatureContainer>
                    
                })
                }
            </RowContainer>
            {bms_active!=-1 && <GreenButton onClick={()=>addGraphs()}>Add Graph +</GreenButton>}
        </Header>
        { bms_active!=-1 && <div>
        <SizedBox/>
          <SmallOne>Mean</SmallOne>
          <CalcOuterContainer className='noscroll'>
            {
              data_mean[`BMS ${bms_active}`].map((item)=><CalcContainer style={{
                backgroundColor: colors[0]
              }}>
                <div style={{ fontWeight: 500}}>{item.name}</div>
                <div>{item.value}</div>
              </CalcContainer>)
            }
          </CalcOuterContainer>
          <SizedBox2/>
          <SmallOne>Median</SmallOne>
          <CalcOuterContainer className='noscroll'>
            {
              data_median[`BMS ${bms_active}`].map((item)=><CalcContainer style={{
                backgroundColor: colors[1]
              }}>
                <div  style={{ fontWeight: 500}}>{item.name}</div>
                <div>{item.value}</div>
              </CalcContainer>)
            }
          </CalcOuterContainer>
          <SizedBox2/>
          <SmallOne>Standard Deviation</SmallOne>
          <CalcOuterContainer className='noscroll'>
            {
              data_std[`BMS ${bms_active}`].map((item)=><CalcContainer style={{
                backgroundColor: colors[2]
              }}>
                <div  style={{ fontWeight: 500}}>{item.name}</div>
                <div>{item.value}</div>
              </CalcContainer>)
            }
          </CalcOuterContainer>
        </div>}
        <SizedBox/>
        {   bms_active !=-1&&
            <ColContainer>
                {
                    bms_graphs[`BMS ${bms_active}`].map((item,index)=>{
                        var tickAmount = Math.ceil(item.data.Current.length/20);
                        // console.log(Math.ceil(tickAmount/20));
                        return (
                          <AreaChart tickAmount={tickAmount} key={index} data={item} index={index} changeLegendVisiblity={changeLegendVisiblity}
                            removeGraph={removeGraph}
                        />
                        );
                        })
                }
                {/* <AreaChart data={bms_data} type="voltage" index={bms_active}/>
                <AreaChart data={bms_data} type="temp" index={bms_active}/>
                <AreaChart data={bms_data} type="current" index={bms_active}/> */}
            </ColContainer>
        }
    </Container>
  )
}

export default ImportData