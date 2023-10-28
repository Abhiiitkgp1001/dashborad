import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Heading from "../components/heading";
import SmallOne from "../components/smallOne";
import SmallTwo from "../components/smallTwo";
import store, { dataAction } from "../store";
import axios from 'axios';
import { create_session } from "../apis/post/create_session";
import { convertDate } from "../helpers/utils";
import { send_data } from "../apis/post/send_data";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;
const FeatureContainer = styled.div`
  width: 180px;
  height: 140px;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  box-shadow: 0px 0px 20px rgba(94, 98, 120, 0.04);
  border-radius: 12px;
  cursor: pointer;
`;

const SizedBox = styled.div`
  display: flex;
  height: 32px;
`;
const SizedBox2 = styled.div`
  display: flex;
  height: 16px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Header2 = styled.div`
  display: flex;
  flex-direction: column;
`;
const GreenButton = styled.div`
  margin-top: auto;
  margin-left: 8px;
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
const ConsoleDiv = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  align-items: baseline;
  gap: 12px;
  height: 250px;
  width: 100%;
  border-radius: 12px;
  background-color: #183d3d;
  padding: 12px 16px;
  color: #f4eeee;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 600;
  align-items: left;
`;
let bluetoothDeviceConnected;
let gattRxCharecteristic;
let gattTxCharecteristic;
const bleService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleRxCharecteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleTxCharecteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const HeaderRow = () => {
  const bms = useSelector((state) => state.bms);
  const cells = useSelector((state) => state.cells);
  const deviceConnected = useSelector((state) => state.deviceConnected);
  const consoleArray = useSelector((state) => state.consoleArray);
  const voltage = useSelector((state) => state.voltage);
  const temp = useSelector((state) => state.voltage);
  const current = useSelector((state) => state.voltage);
  const timestamp = useSelector((state) => state.voltage);
  const bms_cells_voltage = useSelector((state) => state.bms_cells_voltage);
  const bms_temp = useSelector((state) => state.bms_temp);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const consoleFullScreen = useFullScreenHandle();
  const [playConsole, setPlayConsole] = useState(true);
  const [showConsole, setShowConsole] = useState([]);


  useEffect( () => {
    if (deviceConnected === true) {
      dispatch(dataAction.setDevice({
        device_unique_id: "AF-BC-48-29-51-21",
        device_name: "test",
      }));   
      dispatch(dataAction.setBMS());
      dispatch(dataAction.setCells());
      dispatch(dataAction.setVoltage(27));
      dispatch(dataAction.setTemp(8));
      dispatch(dataAction.setCurrent(78));
      dispatch(dataAction.setTimeStamp());
      setTimeout(make_session,1000);
    }
  }, [deviceConnected]);

  useEffect(() => {
    if (deviceConnected === true) {
      const interval = setInterval(() => {

        dispatch(dataAction.setVoltage(27));
        dispatch(dataAction.setTemp(8));
        dispatch(dataAction.setCurrent(78));
        dispatch(dataAction.setTimeStamp());
      }, 4000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [deviceConnected]);

  useEffect(() => {
    if(playConsole){
      setShowConsole(consoleArray);
    }
  }, [playConsole,consoleArray])
  
  const make_session =  async () => {
    const session_name = "Session - "+convertDate(store.getState().timestamp[0]);
    
    var data = {
      device_unique_id: store.getState().device.device_unique_id.toString(),
      device_name: store.getState().device.device_name.toString(),
      no_of_bms: parseInt(store.getState().bms.toString()),
      no_of_cells: store.getState().bms_cells_voltage,
      bms_names: store.getState().bms_cells_voltage.map((item,index)=>`BMS${index}`),
      no_of_temp: store.getState().bms_temp,
      start_time: convertDate(store.getState().timestamp[0]),
      session_name: session_name
    };
    console.log(data);
    const response = await create_session(data);
    if(response.status == 200){
      const res_data = response.data;
      dispatch(dataAction.setSessionId(res_data.session_id));
      dispatch(dataAction.setBMSIds(res_data.bms_ids));
      dispatch(dataAction.setSessionName(session_name));
      save_data();
    }
  }
  const save_data = async () => {
    const datainterval = setInterval(async () => {
      let structured_data = {};
      structured_data["session_id"] = store.getState().session_id;
      structured_data["no_of_bms"] = store.getState().bms;
      structured_data["session_name"] = store.getState().session_name;
      structured_data["start_time"] = convertDate(store.getState().timestamp[0]);
      structured_data["end_time"] = convertDate(store.getState().timestamp[store.getState().timestamp.length-1]);
      let bms_arr = [];
      let end_index = store.getState().current.length;
      for(let i=0;i<store.getState().bms;i++){
        let bms_obj = {};
        bms_obj['bms_id'] = store.getState().bms_ids[i];
        let vol_arr = [];
        for(let j=store.getState().data_sent_index;j<end_index;j++){
          let cur_vol_data = store.getState().voltage[`bms ${i}`][j];
          let filtered_vol_data = [];
          for(let k=0;k<cur_vol_data.length;k++){
            if(cur_vol_data[k]!=undefined) filtered_vol_data.push(cur_vol_data[k]);
          }
          vol_arr.push({
            data: filtered_vol_data,
            timestamp : convertDate(store.getState().timestamp[j])
          });
        }

        let temp_arr = [];
        for(let j=store.getState().data_sent_index;j<end_index;j++){
          let cur_temp_data = store.getState().temp[`bms ${i}`][j];
          let filtered_temp_data = [];
          for(let k=0;k<cur_temp_data.length;k++){
            if(cur_temp_data[k]!=undefined) filtered_temp_data.push(cur_temp_data[k]);
          }
          temp_arr.push({
            data: filtered_temp_data,
            timestamp : convertDate(store.getState().timestamp[j])
          });
        }

        let current_arr = [];
        for(let j=store.getState().data_sent_index;j<end_index;j++){
          
          current_arr.push({
            data: store.getState().current[j],
            timestamp : convertDate(store.getState().timestamp[j])
          });
        }
        bms_obj['voltage'] = vol_arr;
        bms_obj['temp'] = temp_arr;
        bms_obj['current'] = current_arr;
        bms_arr.push(bms_obj)
      }
      structured_data["bms"] =bms_arr;
      console.log(structured_data)
      const response = await send_data(structured_data);
      if(response.status == 200){
        console.log(response.data);
        dispatch(dataAction.setDataSentIndex(end_index));
      }
    }, 60000);

    return () => {
      clearInterval(datainterval);
    };
  }

  async function read() {
    try {
      if (!bluetoothDeviceConnected) await getDeviceInfo();

      await connectGatt();
      await start();
    } catch (err) {
      console.log(err);
    }
  }

  async function getDeviceInfo() {
    let options = {
      filters: [{ name: "NordiART123" }, { name: "Nordic_UART" }],
      optionalServices: [bleService],
    };

    try {
      console.log("Requesting Bluetooth Device...");
      console.log("with " + JSON.stringify(options));
      bluetoothDeviceConnected = await navigator.bluetooth.requestDevice(
        options
      );

      console.log("> Name:             " + bluetoothDeviceConnected.name);
      console.log("> Id:               " + bluetoothDeviceConnected.id);
      console.log(
        "> Connected:        " + bluetoothDeviceConnected.gatt.connected
      );

      bluetoothDeviceConnected.addEventListener(
        "gattserverdisconnected",
        onDisconnected
      );
    } catch (error) {
      console.log("Argh! " + error);
    }
  }

  function onDisconnected(event) {
    const device = event.target;

    console.log(`Device ${device.name} is disconnected.`);

    connectGatt(); // This is to reconnect automatically ??
  }

  async function connectGatt() {
    if (bluetoothDeviceConnected.gatt.connected && gattTxCharecteristic) {
      Promise.resolve();
    } else {
      try {
        const server = await bluetoothDeviceConnected.gatt.connect();
        const service = await server.getPrimaryService(bleService);

        gattTxCharecteristic = await service.getCharacteristic(
          bleTxCharecteristic
        );
        gattRxCharecteristic = await service.getCharacteristic(
          bleRxCharecteristic
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function start() {
    try {
      await gattTxCharecteristic.startNotifications();
      await gattTxCharecteristic.addEventListener(
        "characteristicvaluechanged",
        handleChanged
      );
    } catch (err) {
      console.log(err);
    }
  }

  function handleChanged(event) {
    const receivedData = event.target.value;

    const receivedBuffer = new Uint16Array(receivedData.buffer);

    // if (!verifyandParsePacket(transformedUint16Buffer,receivedData.buffer.byteLength)) {
    //     return;
    // }

    if (receivedBuffer[0] !== 0xa5a5) {
      return;
    }

    let commandType = receivedBuffer[1];

    let numOfItems = receivedBuffer[2];

    if (receivedBuffer[3 + numOfItems] !== 0xb5b5) {
      return;
    }

    switch (commandType) {
      case 0:
        // Number of Slave BMS connected to master
        let numOfSlaveBMS = receivedBuffer[3];
        let masteBMS = 1;
        let totalBMS = masteBMS + numOfSlaveBMS;
        let numOfSlaveBMS_string = "A=" + totalBMS.toString() + ";";

        dispatch(dataAction.setBMS(numOfSlaveBMS_string));
        dispatch(dataAction.setDeviceConnected(true));

        //dispatch here
        break;

      case 1:
        // Total number of cells in the total stack
        let totalNumOfCells = receivedBuffer[3];
        let totalNumOfCells_string = "B=" + totalNumOfCells.toString() + ";";

        dispatch(dataAction.setCells(totalNumOfCells_string));
        break;

      case 2:
        // Voltage values of BMS cells
        let voltage = "V=";
        for (let i = 0; i < numOfItems; i++) {
          let cell_voltage = receivedBuffer[3 + i];
          let cell_voltage_string =
            i.toString() + "," + cell_voltage.toString() + ";";
          voltage += cell_voltage_string;
        }
        dispatch(dataAction.setVoltage(voltage));
        break;

      case 3:
        // Temperature values of BMS boards
        let temperature = "T=";
        for (let i = 0; i < numOfItems; i++) {
          let temp = receivedBuffer[3 + i];
          let temp_string = i.toString() + "," + temp.toString() + ";";
          temperature += temp_string;
        }
        //dispatch here
        console.log(temperature);
        dispatch(dataAction.setTemp(temperature));
        break;

      case 4:
        // Current value from Master BMS
        let current = receivedBuffer[3];
        let current_string = "I=" + current.toString() + ";";
        //dispatch here
        dispatch(dataAction.setCurrent(current_string));
        break;

      default:
        console.log("Received packet has invalid command type.");
        return false;
    }

    return;
  }

  
  return (
    <Container>
      <Header>
        <Heading children="Dashboard - BMS" />
        <Header>
          <GreenButton
            onClick={async () => {
              // read();
              dispatch(dataAction.setDeviceConnected(true));
            }}
          >
            Pair BMS
          </GreenButton>
          <GreenButton
            onClick={() => {
              navigate("/import");
            }}
          >
            Analysis Past Data
          </GreenButton>
        </Header>
      </Header>

      <SizedBox2 />
      <Row gutter={[12, 12]}>
        <Col>
          <FeatureContainer
            style={{
              backgroundColor: "#B4F1FF",
            }}
          >
            <Heading style={{ color: "grey" }}>
              {bms === 0 ? "No Device" : 1}
            </Heading>
            <SizedBox />
            <SmallTwo children="Master BMS" />
          </FeatureContainer>
        </Col>
        <Col>
          <FeatureContainer
            style={{
              backgroundColor: "#B4F1FF",
            }}
          >
            <Heading style={{ color: "grey" }}>
              {bms === 0 ? "No Device" : bms - 1}
            </Heading>
            <SizedBox />
            <SmallTwo children="Number of Slaves BMS" />
          </FeatureContainer>
        </Col>
        <Col>
          <FeatureContainer
            style={{
              backgroundColor: "white",
            }}
          >
            <Heading style={{ color: "grey" }}>
              {bms === 0 ? "No Device" : cells}
            </Heading>
            <SizedBox />
            <SmallTwo children="Total number of cells" />
          </FeatureContainer>
        </Col>
      </Row>
      { deviceConnected && <Header2>
        <SizedBox />
        <Header>
        <SmallOne children="Live Console" />
       <Header>
       <GreenButton onClick={()=>setPlayConsole(!playConsole)}>{playConsole?"Pause":"Play"}</GreenButton>
       <GreenButton onClick={consoleFullScreen.enter}>FullScreen</GreenButton>
       </Header>
        
        </Header>
        
        <SizedBox2 />
        <FullScreen handle={consoleFullScreen}>
        <ConsoleDiv style={{
          height: consoleFullScreen.active ? '100vh':'250px'
        }}>
          {showConsole
            .slice(0)
            .reverse()
            .map((item, index) => (
              <div key={index}>{item}</div>
            ))}
        </ConsoleDiv>
      </FullScreen>
        
      </Header2>}
    </Container>
  );
};

export default HeaderRow;
