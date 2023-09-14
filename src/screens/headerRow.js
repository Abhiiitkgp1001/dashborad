import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Heading from "../components/heading";
import SmallTwo from "../components/smallTwo";
import { dataAction } from "../store";
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (deviceConnected === true) {
      dispatch(dataAction.setBMS());
      dispatch(dataAction.setCells());
      dispatch(dataAction.setVoltage(27));
      dispatch(dataAction.setTemp(8));
      dispatch(dataAction.setCurrent(78));
    }
  }, [deviceConnected]);

  useEffect(() => {
    if (deviceConnected === true) {
      const interval = setInterval(() => {
        dispatch(dataAction.setVoltage(27));
        dispatch(dataAction.setTemp(8));
        dispatch(dataAction.setCurrent(78));
      }, 4000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [deviceConnected]);

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
        <GreenButton
          onClick={() => {
            // read();
            dispatch(dataAction.setDeviceConnected(true));
          }}
        >
          Pair BMS
        </GreenButton>
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
    </Container>
  );
};

export default HeaderRow;
