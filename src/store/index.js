import {configureStore, createSlice} from '@reduxjs/toolkit';

const initialState = {bms:0,cells:0,current:[],voltage:{},temp:{}, deviceConnected:false};

const dataSlice = createSlice({
  name: 'bms',
  initialState: initialState,
  reducers: {
    setDeviceConnected: (state, action) => {
        state.deviceConnected = action.payload;
    },
    setBMS: (state, action) => {
        var data = action.payload;
        console.log(data);
        // var data = "A=2;";
        var slicedData = data.substring(2).replace(';','');
        
        state.bms = slicedData;
    },
    setCells: (state, action) => {
        var data = action.payload;
        var slicedData = data.substring(2).replace(';','');
        state.cells = slicedData;
    },
    setCurrent: (state, action) => {
        //var data = "I=18;";
        var data = action.payload;
        var slicedData = data.substring(2).replace(';','');
        state.current.push(slicedData);
    },
    setVoltage: (state,action)=>{
       // var data = "V=0,80;1,2;2,4;3,8;4,2;5,6;6,2;7,2;8,1;9,0;10,99;11,32;12,2;13,6;14,2;15,2;16,1;17,0;18,99;19,32;20,13;"
        var data = action.payload;
        var slicedData = data.substring(2).split(';');
        slicedData.pop();
        var num_bms = slicedData.length%16==0 ? parseInt(slicedData.length/16) : parseInt(slicedData.length/16)+1;
        var vol = Array.from({ length: num_bms }, () => Array(16).fill(undefined));
        
        for(var i=0;i<num_bms;i++){
            for(var j=0;j<16;j++){
                if((16*i+j)<slicedData.length)
                    vol[i][j] = parseFloat(slicedData[16*i+j].split(',')[1]);
                    //vol[i][j] = Math.round(Math.random()*1000)/100;
            }
        }
        var obj = {...state.voltage};
        
        for(var i=0;i<num_bms;i++){
            if(!Object.keys(obj).includes(`bms ${i}`))
                obj[`bms ${i}`]=[];    
            obj[`bms ${i}`].push(vol[i]);
        }
        console.log(obj);
        state.voltage = obj;
    },
    setTemp: (state,action)=>{
        //var data = "T=0,1;1,2;2,4;3,8;4,2;5,6;6,2;7,2;"
        var data = action.payload;
        console.log(data);
        var slicedData = data.substring(2).split(';');
        slicedData.pop();
        var num_bms = slicedData.length%5==0 ? parseInt(slicedData.length/5) :parseInt(slicedData.length/5)+1;
        var temp = Array.from({ length: num_bms }, () => Array(5).fill(undefined));
        
        for(var i=0;i<num_bms;i++){
            for(var j=0;j<5;j++){
                if((5*i+j)<slicedData.length)
                    temp[i][j] = parseFloat(slicedData[5*i+j].split(',')[1]);
                    //temp[i][j] = Math.round(Math.random()*1000)/100;
            }
        }
        var obj = {...state.temp};
        
        for(var i=0;i<num_bms;i++){
            if(!Object.keys(obj).includes(`bms ${i}`))
                obj[`bms ${i}`]=[];    
            obj[`bms ${i}`].push(temp[i]);
        }
        state.temp = obj;
    }

    
  },
});


export const dataAction = dataSlice.actions;

const store = configureStore({reducer: dataSlice.reducer});

export default store;
