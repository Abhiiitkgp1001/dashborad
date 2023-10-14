import { Table } from "antd";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import VoltageRadialChart from "../components/VoltageRadialChart";
import Heading from "../components/heading";
import TempRadialChart from "../components/tempRadialChart";
import SmallOne from "../components/smallOne";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;

const SizedBox = styled.div`
  display: flex;
  height: 32px;
`;

const TableCellContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
`;

const TableText2 = styled.div`
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  color: #b5b5c3;
`;

const CustomerText = styled.div`
  font-family: Poppins;
  font-size: 13.5px;
  font-weight: 700;
  color: #3f4254;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding: 24px 12px 24px 24px;
  background-color: white;
  border-radius: 12px;
`;

const BMSTable = styled(Table)`
  .ant-table-thead .ant-table-cell {
    background-color: white;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 700;
    color: #b5b5c3;
  }
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

const HeadingRow = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: space-between;
`;

const RadialGraphRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-around;
`;

const Customers = () => {
  const voltage = useSelector((state) => state.voltage);
  const temp = useSelector((state) => state.temp);
  const current = useSelector((state) => state.current);
  const num_bms = useSelector((state) => state.bms);
  const [td, setTD] = useState([]);
  const [showGraph, setShowGraph] = useState(0);
  const time = useSelector((state) => state.timestamp);
  const [start, setStart] = useState(-1);
  const [stop, setStop] = useState(-1);
  const columns = [
    {
      title: "Name",
      dataIndex: "key",
      key: "1",
      width: 100,
      render: (key) => (
        <TableCellContainer2>
          <CustomerText
            onClick={() => {
              setShowGraph(key);
              console.log(key);
            }}
          >{`BMS ${key + 1}`}</CustomerText>
        </TableCellContainer2>
      ),
    },
    {
      title: "Current",
      dataIndex: "current",
      key: "2",
      width: 80,
      render: (current) => (
        <TableCellContainer2>
          <TableText2>{current}</TableText2>
        </TableCellContainer2>
      ),
    },
  ];
  for (var i = 0; i < 16; i++) {
    var v = `v ${i}`;
    columns.push({
      title: `V ${i + 1}`,
      dataIndex: v,
      key: i + 3,
      width: 80,
      render: (v) => (
        <TableCellContainer2>
          <TableText2>{v}</TableText2>
        </TableCellContainer2>
      ),
    });
  }
  for (var i = 0; i < 5; i++) {
    var t = `t ${i}`;
    columns.push({
      title: `T ${i + 1}`,
      dataIndex: t,
      key: i + 19,
      width: 80,
      render: (t) => (
        <TableCellContainer2>
          <TableText2>{t}</TableText2>
        </TableCellContainer2>
      ),
    });
  }

  useEffect(() => {
    if (voltage["bms 0"] && temp["bms 0"] != undefined) {
      var table_data = [];
      for (let i = 0; i < num_bms; i++) {
        var cur_bms = {};
        cur_bms["key"] = i;
        for (var j = 0; j < 16; j++) {
          cur_bms[`v ${j}`] =
            voltage[`bms ${i}`][voltage[`bms ${i}`].length - 1][j] == undefined
              ? "-"
              : voltage[`bms ${i}`][voltage[`bms ${i}`].length - 1][j];
        }
        for (let j = 0; j < 5; j++) {
          cur_bms[`t ${j}`] =
            temp[`bms ${i}`][temp[`bms ${i}`].length - 1][j] == undefined
              ? "-"
              : temp[`bms ${i}`][temp[`bms ${i}`].length - 1][j];
        }
        cur_bms["current"] = current[current.length - 1];
        table_data.push(cur_bms);
      }

      // console.log(table_data);
      setTD(table_data);
    }
  }, [voltage, current, temp]);

  function startRec() {
    console.log("started recording");
    setStart(voltage[`bms 0`].length);
    console.log(voltage[`bms 0`].length, time[time.length - 1]);
  }

  function stopRec() {
    console.log("stopped recording");
    setStop(voltage[`bms 0`].length);
    console.log(voltage[`bms 0`].length, time[time.length - 1]);
  }

  function preprocess2d(data, st, en) {
    var k = data[0].length;
    for (var i = 0; i < data[0].length; i++) {
      if (data[0][i] === undefined) {
        k = i;
        break;
      }
    }
    var section = data.slice(st, en).map(i => i.slice(0, k));
    return section;
  }

  function preprocess1d(data, st, en) {
    var section = data.slice(st, en);
    return section;
  }


  function preprocesstime(data, st, en) {
    var section = data.slice(st, en);
    var timeFormats = [];

    for (const timestamp of section) {
      const seconds = timestamp / 1000; // Convert milliseconds to seconds
      const dt = new Date(seconds * 1000); // Convert seconds to milliseconds
      console.log(dt.toISOString());
      const timeFormat = dt.toISOString(); // Extract HH:MM:SS from ISO string
      
      timeFormats.push(timeFormat);
    }

    return timeFormats;
  }

  function is2DArray(arr) {
    return arr.some(Array.isArray);
  }

  function exportData(f) {
    console.log("Export Started");
    var XLSX = require("xlsx");
    var wb = XLSX.utils.book_new();
    for (var i = 0; i < num_bms; i++) {
      var voldata = voltage[`bms ${i}`];
      var tempdata = temp[`bms ${i}`];
      var st = 0, en = voldata.length;
      if (f) {
        if (start !== -1) {
          st = start;
        }
        if (stop !== -1) {
          en = stop;
        }
      }

      if (is2DArray(voldata)) {
        voldata = preprocess2d(voldata, st, en);
      }
      else {
        voldata = preprocess1d(voldata, st, en);
      }

      if (is2DArray(tempdata)) {
        tempdata = preprocess2d(tempdata, st, en);
      }
      else {
        tempdata = preprocess1d(tempdata, st, en);
      }
      var time1 = preprocesstime(time, st, en);
      var cur = preprocess1d(current, st, en);

      var head = ["Timestamp", "Current"];
      for (var j = 0; j < voldata[0].length; j++) {
        head.push("V ".concat(j + 1));
      }
      for (var j = 0; j < tempdata[0].length; j++) {
        head.push("T ".concat(j + 1));
      }

      var result = [head];
      for (var j = 0; j < voldata.length; j++) {
        var row = [time1[j], cur[j]].concat(voldata[j]);
        row = row.concat(tempdata[j]);
        result.push(row);
      }
      var ws = XLSX.utils.aoa_to_sheet(result);
      XLSX.utils.book_append_sheet(wb, ws, "BMS ".concat(i));
    }
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "DataFile.xlsx"
    );
    console.log("Exported");
    setStart(-1);
    setStop(-1);
  }

  const [isRecording, setIsRecording] = useState(false);

  const handleToggleClick = () => {
    if (isRecording) {
      stopRec();
    } else {
      startRec();
    }
    setIsRecording(!isRecording);
  };

  return (
    <Container>
      <HeadingRow>
        <Heading children="Dynamic data" />
        <HeadingRow>
        <GreenButton onClick={handleToggleClick}>
          {isRecording ? 'Stop Rec' : 'Start Rec'}
        </GreenButton>
        <GreenButton onClick={() => exportData(1)}>Export Rec</GreenButton>
        <GreenButton onClick={() => exportData(0)}>Export Session</GreenButton>
        </HeadingRow>
      </HeadingRow>
      <SizedBox/>
      <RadialGraphRow>
        
        <SmallOne>
          Voltage
        </SmallOne>
        <SmallOne>
          Temperature
        </SmallOne>
      </RadialGraphRow>
      <HeadingRow>
        
        <VoltageRadialChart index={showGraph} graphData={voltage} />
        <TempRadialChart index2={showGraph} graphData2={temp} />
      </HeadingRow>
      <SizedBox />
      {
        <TableContainer>
          <BMSTable
            columns={columns}
            dataSource={td}
            scroll={{
              x: 200,
              y: 900,
            }}
          />
        </TableContainer>
      }
    </Container>
  );
};
export default Customers;
