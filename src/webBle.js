

let bluetoothDeviceConnected;
let gattRxCharecteristic;
let gattTxCharecteristic;

const bleService          = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const bleRxCharecteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const bleTxCharecteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

function isWebBluetoothEnabled() {
if (navigator.bluetooth) {
	return true;
} else {
	// ChromeSamples.setStatus('Web Bluetooth API is not available.\n' +
	// 	'Please make sure the "Experimental Web Platform features" flag is enabled.');
	return false;
}
}

function onDisconnected(event) {
const device = event.target;

console.log(`Device ${device.name} is disconnected.`);

connectGatt();
}

async function getDeviceInfo() {
if (!isWebBluetoothEnabled()) return;

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

/*
Data Contatining relevant values
*/

let numOfSlaveBMS = 0;
let totalNumOfCells = 0;

// This can either be the number of cellVoltages or boardTempValues
// This is updated everytime data arrives so is always up to date

let numOfItems = 0;

const cellVoltageValues = new Uint16Array(36 * 16);
const boardTempValues = new Uint16Array(36 * 5);
let currentValue = 0;

function printData(commandType) {
switch (commandType) {
	case 0:
		// Number of Slave BMS connected to master
		console.log(numOfSlaveBMS);
		return;

	case 1:
		// Total number of cells in the total stack
		console.log(totalNumOfCells);
		return;

	case 2:
		// Voltage values of BMS cells
		for (let i = 0; i < numOfItems && i < ((numOfSlaveBMS + 1) * 16); i++) {
			console.log(cellVoltageValues[i]);
		}
		return;

	case 3:
		// Temperature values of BMS boards
		for (let i = 0; i < numOfItems && i < ((numOfSlaveBMS + 1) * 5); i++) {
			console.log(boardTempValues[i]);
		}
		return;

	case 4:
		// Current value from Master BMS
		console.log(currentValue);
		return;

	default:
		throw new Error("This should never have been executed!!!!");
}
}

function verifyandParsePacket(receivedBuffer) {

if (receivedBuffer[0] !== 0xA5A5) {
	return false;
}

const commandType = receivedBuffer[1];

numOfItems = receivedBuffer[2];

if (receivedBuffer[3 + numOfItems] !== 0xB5B5) {
	return false;
}

switch(commandType) {
	case 0:
		// Number of Slave BMS connected to master
		numOfSlaveBMS = receivedBuffer[3];
		break;
	
	case 1:
		// Total number of cells in the total stack
		totalNumOfCells = receivedBuffer[3];
		break;
	
	case 2:
		// Voltage values of BMS cells
		for (let i = 0; i < numOfItems && i < ((numOfSlaveBMS + 1) * 16); i++) {
			cellVoltageValues[i] = receivedBuffer[3 + i];
		}
		break;
	
	case 3:
		// Temperature values of BMS boards
		for (let i = 0; i < numOfItems && i < ((numOfSlaveBMS + 1) * 5); i++) {
			boardTempValues[i] = receivedBuffer[3 + i];
		}
		break;
	
	case 4:
		// Current value from Master BMS
		currentValue = receivedBuffer[3];
		break;
	
	default:
		console.log("Received packet has invalid command type.");
		return false;
}

//console.log(commandType);
//printData(commandType);

return true;
}

function handleChanged(event) {
const receivedData = event.target.value;

const transformedUint16Buffer = new Uint16Array(receivedData.buffer);

if (!verifyandParsePacket(transformedUint16Buffer,receivedData.buffer.byteLength)) {
	return;
}

// Packet is verfied and data has been parsed.

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

// async function send_value() {
// try {
// 	let buf = new ArrayBuffer(8);
// 	let arr = new BigUint64Array(buf);
// 	arr[0] = BigInt(Date.now());

// 	console.log(arr[0]);
// 	console.log(buf)
// 	gattRxCharecteristic.writeValue(buf);
// 	console.log("Successfully updated the time.");
// }
// catch (err) {
// 	console.log(err);
// }
// }

async function start() {
try {
	await gattTxCharecteristic.startNotifications();
	await gattTxCharecteristic.addEventListener('characteristicvaluechanged', handleChanged);
}
catch (err) {
	console.log(err);
}
}

async function stop() {
try {
	await gattTxCharecteristic.removeEventListener('characteristicvaluechanged', handleChanged);
	gattTxCharecteristic.stopNotifications();
}
catch (err) {
	console.log(err);
}
}


