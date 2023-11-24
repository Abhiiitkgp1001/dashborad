import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: null,
  token: null,
  alert: null,
  session_id: null,
  session_name: null,
  bms_ids: [],
  bms: 0,
  device: {},
  data_sent_index:0,
  cells: 0,
  bms_cells_voltage: [],
  bms_temp: [],
  current: [],
  voltage: {},
  temp: {},
  timestamp: [],
  deviceConnected: false,
  chartData: [],
  voltageChartData: [],
  tempChartData: [],
  graphActiveTab: [],
  graphActiveBMSIndex: [],
  graphPlayPause: [],
  consoleArray: [],
};

const dataSlice = createSlice({
  name: "bms",
  initialState: initialState,
  reducers: {
    setUserData: (state, action)=>{
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
      const user_data = {
        token: action.payload.token,
        user_id:  action.payload.user_id
      }
      localStorage.setItem('user_data', JSON.stringify(user_data));

    },
    setAlert: (state, action)=>{
      state.alert = action.payload;
    },
    setDevice: (state,action)=>{
      state.device = action.payload;
    },
    setSessionId: (state, action) => {
      state.session_id = action.payload;
    },
    setSessionName: (state, action) => {
      state.session_name = action.payload;
    },
    setBMSIds: (state, action) => {
      state.bms_ids = action.payload;
    },
    setDeviceConnected: (state, action) => {
      state.deviceConnected = action.payload;
    },
    setDataSentIndex: (state,action) => {
      state.data_sent_index = action.payload;
    },
    setBMS: (state, action) => {
      // var data = action.payload;
      // console.log(data);
      var data = "A=2;";
      var slicedData = data.substring(2).replace(";", "");
      state.consoleArray.push(data);
      state.bms = slicedData;
    },
    setCells: (state, action) => {
      // var data = action.payload;
      var data = "B=21;";
      var slicedData = data.substring(2).replace(";", "");
      state.consoleArray.push(data);
      state.cells = slicedData;
    },
    setCurrent: (state, action) => {
      var data = `I=${Math.round(Math.random()*1000)/100};`;
      // var data = action.payload;
      var slicedData = data.substring(2).replace(";", "");
      state.consoleArray.push(data);
      
      state.current.push(slicedData);
      
    },
    setVoltage: (state, action) => {
      var data =
        "V=0,80;1,2;2,4;3,8;4,2;5,6;6,2;7,2;8,1;9,0;10,99;11,32;12,2;13,6;14,2;15,2;16,1;17,0;18,99;19,32;20,13;";
      // var data = action.payload;
      var slicedData = data.substring(2).split(";");
      state.consoleArray.push(data);
      slicedData.pop();
      var num_bms =
        slicedData.length % 16 == 0
          ? parseInt(slicedData.length / 16)
          : parseInt(slicedData.length / 16) + 1;
      var vol = Array.from({ length: num_bms }, () =>
        Array(16).fill(undefined)
      );
      
      let no = [];
      for (var i = 0; i < num_bms; i++) {
        let cnt = 0;
        for (var j = 0; j < 16; j++) {
          if (16 * i + j < slicedData.length){
            cnt++;
            // vol[i][j] = parseFloat(slicedData[16*i+j].split(',')[1]);
            vol[i][j] = Math.round(Math.random() * 1000) / 100;
          }
        }
        no[i] = cnt;
      }
      var obj = { ...state.voltage };
      
      for (var i = 0; i < num_bms; i++) {
        if (!Object.keys(obj).includes(`bms ${i}`)) obj[`bms ${i}`] = [];
        obj[`bms ${i}`].push(vol[i]);
      }
      // console.log(obj);
      // console.log(no);
      state.voltage = obj;
      state.bms_cells_voltage = no;
    },
    setTemp: (state, action) => {
      var data = "T=0,1;1,2;2,4;3,8;4,2;5,6;6,2;7,2;";
      // var data = action.payload;
      // console.log(data);
      var slicedData = data.substring(2).split(";");
      state.consoleArray.push(data);
      slicedData.pop();
      var num_bms =
        slicedData.length % 5 == 0
          ? parseInt(slicedData.length / 5)
          : parseInt(slicedData.length / 5) + 1;
      var temp = Array.from({ length: num_bms }, () =>
        Array(5).fill(undefined)
      );
      let no = [];
      for (var i = 0; i < num_bms; i++) {
        let cnt = 0;
        for (var j = 0; j < 5; j++) {
          if (5 * i + j < slicedData.length){
            cnt++;
            // temp[i][j] = parseFloat(slicedData[5*i+j].split(',')[1]);
            temp[i][j] = Math.round(Math.random() * 1000) / 100;
          }
          
        }
        no[i] = cnt;
      }
      var obj = { ...state.temp };
      
      for (var i = 0; i < num_bms; i++) {
        if (!Object.keys(obj).includes(`bms ${i}`)) obj[`bms ${i}`] = [];
        obj[`bms ${i}`].push(temp[i]);
      }
      state.temp = obj;
      state.bms_temp = no;
      // console.log(no);
    },
    setTempChartData: (state, action) => {
      var data = action.payload;
      let prevChartData = state.tempChartData.filter(
        (chart) => chart.id !== data.id
      );
      if (data.btn === null) {
        state.tempChartData = [...prevChartData];
      } else {
        state.tempChartData = [...prevChartData, data];
      }
    },
    setVoltageChartData: (state, action) => {
      var data = action.payload;
      let prevChartData = state.voltageChartData.filter(
        (chart) => chart.id !== data.id
      );
      if (data.data === null) {
        state.voltageChartData = [...prevChartData];
      } else {
        state.voltageChartData = [...prevChartData, data];
      }
    },
    setGraphActiveTab: (state, action) => {
      var data = action.payload;
      let prevChartData = state.graphActiveTab.filter(
        (chart) => chart.id !== data.id
      );
      if (data.tabNumber === null) {
        state.graphActiveTab = [...prevChartData];
      } else {
        state.graphActiveTab = [...prevChartData, data];
      }
    },
    setGraphActiveBMSIndex: (state, action) => {
      var data = action.payload;
      let prevChartData = state.graphActiveBMSIndex.filter(
        (chart) => chart.id !== data.id
      );
      if (data.bms === null) {
        state.graphActiveBMSIndex = [...prevChartData];
      } else {
        state.graphActiveBMSIndex = [...prevChartData, data];
      }
    },
    setGraphPlayPause: (state, action) => {
      var data = action.payload;
      let prevChartData = state.graphPlayPause.filter(
        (chart) => chart.id !== data.id
      );
      if (data.btn === null) {
        state.graphPlayPause = [...prevChartData];
      } else {
        state.graphPlayPause = [...prevChartData, data];
      }
    },
    setTimeStamp: (state, action) => {
      var data = action.payload;
      var currentdate = new Date().getTime() + 330 * 60 * 1000;
      state.timestamp.push(currentdate);
      // console.log(currentdate);
    },

    setChartData: (state, action) => {
      var data = action.payload;
      let prevChartData = state.chartData.filter(
        (chart) => chart.id !== data.id
      );
      if (data.data === null) {
        state.chartData = [...prevChartData];
      } else {
        state.chartData = [...prevChartData, data];
      }
    },
  },
});

export const dataAction = dataSlice.actions;

const store = configureStore({ reducer: dataSlice.reducer });

export default store;
