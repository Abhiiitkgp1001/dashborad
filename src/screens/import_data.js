import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Heading from '../components/heading';
import { read, utils} from 'xlsx';
import AreaChart from '../components/AreaChart';
import { mean, median, standardDeviation } from '../helpers/utils';
import SmallOne from '../components/smallOne';
import { Modal, Spin } from 'antd';
import { get_all_session } from '../apis/get/get_all_sessions';
import { get_session_data } from '../apis/get/get_session_data';
import BarChart from '../components/BarChart';
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
const SizedBoxW = styled.div`
    display: flex;
    width: 12px;
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
const SessionsContainer = styled.div`
display: flex;
max-height: 400px;
flex-direction: column;
overflow-y: scroll;
gap: 16px;
padding-top: 12px;
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
    const [allSessions, setAllSessions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [spining, setSpining] = useState(false);
    const [bms_data_bar_graph, setBMSDataBarGraph] = useState({});
    useEffect( () => {
      get_sessions();
    }, [])
    
    const get_sessions  = async()=>{
      const response = await get_all_session();
      if(response.status == 200){
        console.log(response.data);
        setIsLoading(false);
        setAllSessions(response.data);
      }
    }

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
                                if(j=="Timestamp"){
                                  var date = obj[j].toString().slice();
                                  let formattedDate = date.slice().substring(0,10).replaceAll("-","/");
                                  let formattedTime = date.slice().substring(11);
                                  formattedTime = formattedTime.substring(0,8)
                                  filtered_data[j].push(formattedDate+" "+formattedTime);
                                }else{
                                  filtered_data[j].push(obj[j]);
                                }
                            }
                        }
                        let legend = {};
                        for(let i in filtered_data){
                            if(i!="Timestamp"){
                              legend[i] = {
                                name:i,
                                visible: false,
                            }
                            }
                        }
                        parsedData[key] = {
                            data : filtered_data,
                            legend : legend
                        }
                    }
                     console.log(parsedData);
                    setBMSData(parsedData);
                    setBMSGraphs(graphs);
                    insightsData(parsedData);
                    
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
    const changeLegendVisiblityBarGraph = (item)=>{
      let changed_graph = {...bms_data_bar_graph};
      changed_graph[`BMS ${bms_active}`]["legend"][item].visible = !changed_graph[`BMS ${bms_active}`]["legend"][item].visible;
      setBMSDataBarGraph(changed_graph);
  }
    const addGraphs = ()=>{
        let add_graph_current_selected_bms = {...bms_graphs};
        let new_item = JSON.parse(JSON.stringify(bms_data[`BMS ${bms_active}`]));;
        add_graph_current_selected_bms[`BMS ${bms_active}`].push(new_item)
        setBMSGraphs(add_graph_current_selected_bms);
    }

    const convertData = (cloudData)=>{
      var parsedData = {};
      var graph ={};
      for(let i=0;i<cloudData.bms.length;i++){
        let c_data = {};
        let c_legend = {};
        let obj = cloudData.bms[i];

        let vol_data = obj.voltage;
        for(let j=0;j<vol_data.length;j++){
          let vol_obj = vol_data[j].data;
          let vol_arr = [];
          for(let k=0;k<vol_obj.length;k++){
            vol_arr.push(vol_obj[k].value);
          }
          c_data[vol_data[j].cell_name]=vol_arr;
          c_legend[vol_data[j].cell_name] = {
            name: vol_data[j].cell_name,
            visible: false,
          }
        }

        let temp_data = obj.temp;
        for(let j=0;j<temp_data.length;j++){
          let temp_obj = temp_data[j].data;
          let temp_arr = [];
          let timeStamp = [];
          for(let k=0;k<temp_obj.length;k++){
            temp_arr.push(temp_obj[k].value);

            var date = temp_obj[k].timeStamp.toString().slice();
            let formattedDate = date.slice().substring(0,10).replaceAll("-","/");
            let formattedTime = date.slice().substring(11);
            formattedTime = formattedTime.substring(0,8);
            timeStamp.push(formattedDate+" "+formattedTime);
          }
          
          c_data["Timestamp"] = timeStamp;

          c_data[temp_data[j].temp_name]=temp_arr;
          c_legend[temp_data[j].temp_name] = {
            name: temp_data[j].temp_name,
            visible: false,
          }
        }

        let current_data = obj.current;
        for(let j=0;j<current_data.length;j++){
          let current_obj = current_data[j].data;
          let current_arr = [];
          for(let k=0;k<current_obj.length;k++){
            current_arr.push(current_obj[k].value);
          }
          c_data["Current"]=current_arr;
          c_legend["Current"] = {
            name: "Current",
            visible: false,
          }
        }
        parsedData[`BMS ${i}`] = {
          data: c_data,
          legend: c_legend,
        }
        graph[`BMS ${i}`] =[];
      }
      console.log(parsedData);
      setBMSData(parsedData);
      setBMSGraphs(graph);
      insightsData(parsedData);
    }
  const insightsData = (parsedData)=>{
    let overall_data_means = {};
    let overall_data_medians = {};
    let overall_data_stds = {};
    let bar_graph_data = {};
    for(let key in parsedData){
        let data_means = [];
        let data_medians = [];
        let data_stds = [];
        let legends = {};
        for(let i in parsedData[key].data){
            if(i!="Timestamp"){
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
            legends[i] = {
              name: i,
              visible: true,
            };
            }
        }
        overall_data_means[key] = data_means;
        overall_data_medians[key] = data_medians;
        overall_data_stds[key] = data_stds;
        bar_graph_data[key]=bar_graph_data[key]||{};
        bar_graph_data[key].mean = data_means;
        bar_graph_data[key].median = data_medians;
        bar_graph_data[key].std = data_stds;
        bar_graph_data[key].legend = legends;
    }
    setDataMean(overall_data_means);
    setDataMedian(overall_data_medians);
    setDataStd(overall_data_stds);
    console.log(bar_graph_data);
    setBMSDataBarGraph(bar_graph_data);
  }
  return (
    <Container>
        <Header>
            <Heading children="Analysis Past Data"/>
            
            <Header>
            <div style={{marginBottom: '8px'}}>
              <GreenButton onClick={()=> setIsOpen(true)}>Fetch Past Sessions</GreenButton>
              <Modal title="Select Session" open={isOpen} footer="" onOk={()=>{}} onCancel= {spining?()=>{}: ()=>setIsOpen(false)}>
                <Spin spinning={spining} >
                <SessionsContainer className='noscroll'>
                {
                  allSessions.map((item,index)=>(
                    <GreenButton key={index} onClick={async ()=>{
                      setSpining(true);
                      const response = await get_session_data(item._id);
                      if(response.status==200){
                        setSpining(false);
                        setIsOpen(false);
                        console.log(response.data);
                        convertData(response.data);
                      }
                    }}>{item.session_name}</GreenButton>
                  ))
                }
                </SessionsContainer>
                </Spin>
              </Modal>
            </div>
            <SizedBoxW/>
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
        {bms_active!=-1 && <div>
          <SizedBox/>
          <BarChart data={bms_data_bar_graph[`BMS ${bms_active}`]} bms_active={bms_active} changeLegendVisiblityBarGraph={changeLegendVisiblityBarGraph}/>
          </div>}
        {/* { bms_active!=-1 && <div>
          <SizedBox/>
          <BarChart data={bms_data_bar_graph[`BMS ${bms_active}`]} bms_active={bms_active} changeLegendVisiblityBarGraph={changeLegendVisiblityBarGraph}/>
        <SizedBox/>
          <SmallOne>Mean</SmallOne>
          <CalcOuterContainer className='noscroll'>
            {
              data_mean[`BMS ${bms_active}`].map((item,index)=><CalcContainer key={index} style={{
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
              data_median[`BMS ${bms_active}`].map((item,index)=><CalcContainer key={index} style={{
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
              data_std[`BMS ${bms_active}`].map((item,index)=><CalcContainer key={index} style={{
                backgroundColor: colors[2]
              }}>
                <div  style={{ fontWeight: 500}}>{item.name}</div>
                <div>{item.value}</div>
              </CalcContainer>)
            }
          </CalcOuterContainer>
        </div>}
        <SizedBox/> */}
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
