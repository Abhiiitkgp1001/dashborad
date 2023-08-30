let bluetoothDeviceConnected;
let gattRxCharecteristic;
let gattTxCharecteristic;
const bleService          = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const bleRxCharecteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const bleTxCharecteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

async function read() {
    try {
        if (!bluetoothDeviceConnected)
            await getDeviceInfo();

        await connectGatt();
        await start();
    }
    catch (err) {
        console.log(err)
    }   
}

async function getDeviceInfo() {
    
    let options = {
        filters: [{ name: "NordiART123" }, { name: "Nordic_UART" }],
        optionalServices: [bleService]
    };
    
    try {
        console.log('Requesting Bluetooth Device...');
        console.log('with ' + JSON.stringify(options));
        bluetoothDeviceConnected = await navigator.bluetooth.requestDevice(options);
    
        console.log('> Name:             ' + bluetoothDeviceConnected.name);
        console.log('> Id:               ' + bluetoothDeviceConnected.id);
        console.log('> Connected:        ' + bluetoothDeviceConnected.gatt.connected);
    
        bluetoothDeviceConnected.addEventListener('gattserverdisconnected', onDisconnected);
    }
    
    catch (error) {
        console.log('Argh! ' + error);
    }
}

function onDisconnected(event) {
    const device = event.target;
    
    console.log(`Device ${device.name} is disconnected.`);
    
    connectGatt();// This is to reconnect automatically ??
}

async function connectGatt() {
    if (bluetoothDeviceConnected.gatt.connected && gattTxCharecteristic) {
        Promise.resolve();
    }
    else {
        try {
            const server = await bluetoothDeviceConnected.gatt.connect();
            const service = await server.getPrimaryService(bleService);
    
            gattTxCharecteristic = await service.getCharacteristic(bleTxCharecteristic);
            gattRxCharecteristic = await service.getCharacteristic(bleRxCharecteristic);
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function start() {
    try {
        await gattTxCharecteristic.startNotifications();
        await gattTxCharecteristic.addEventListener('characteristicvaluechanged', handleChanged);
    }
    catch (err) {
        console.log(err);
    }
}

function handleChanged(event) {
    const receivedData = event.target.value;
    
    const receivedBuffer = new Uint16Array(receivedData.buffer);
    
    // if (!verifyandParsePacket(transformedUint16Buffer,receivedData.buffer.byteLength)) {
    //     return;
    // }
    if (receivedBuffer[0] !== 0xA5A5) {
        return;
    }
    
    let commandType = receivedBuffer[1];
    
    let numOfItems = receivedBuffer[2];
    
    if (receivedBuffer[3 + numOfItems] !== 0xB5B5) {
        return;
    }
 
  
    switch(commandType) {
        case 0:
            // Number of Slave BMS connected to master
            let numOfSlaveBMS = receivedBuffer[3];
            let numOfSlaveBMS_string = "A="+numOfSlaveBMS.toString()+";";
            //dispatch here
            break;
        
        case 1:
            // Total number of cells in the total stack
            let totalNumOfCells = receivedBuffer[3];
            let totalNumOfCells_string = "B="+totalNumOfCells.toString()+";";
            //dispatch here
            break;
        
        case 2:
            // Voltage values of BMS cells
            let voltage = "V=";
            for (let i = 0; i < numOfItems; i++) {
                let cell_voltage = receivedBuffer[3 + i];
                let cell_voltage_string = i.toString()+","+cell_voltage.toString()+";";
                voltage += cell_voltage_string;
            }
            //dispatch here
            break;
        
        case 3:
            // Temperature values of BMS boards
            let temperature = "T=";
            for (let i = 0; i < numOfItems; i++) {
                let temp = receivedBuffer[3 + i];
                let temp_string = i.toString()+","+temp.toString()+";";
                temperature += temp_string;
            }
            //dispatch here
            break;
        
        case 4:
            // Current value from Master BMS
            let current = receivedBuffer[3];
            let current_string = "I="+current.toString()+";";
            //dispatch here
            break;
        
        default:
            console.log("Received packet has invalid command type.");
            return false;
    }
    
    return;
    
}
    