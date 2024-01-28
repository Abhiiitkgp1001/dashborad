import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import Heading from '../components/heading';
import PieChart from '../components/PieChart';
import SmallTwo from '../components/smallTwo';
import { Progress, Modal, Spin,Select } from 'antd';
import SmallOne from '../components/smallOne';
import SmallThree from '../components/smallThree';
import TextField from '../components/TextField';
import { emailRegex, phoneRegex } from '../config';
import { create_pilot } from '../apis/post/create_pilot';
import { useDispatch, useSelector } from 'react-redux';
import { dataAction } from '../store';
import { get_all_pilots } from '../apis/get/get_all_pilots';
import { add_vehicle } from '../apis/post/create_vehicle';
import { get_all_vehicles } from '../apis/get/get_all_vehicles';
import { delete_vehicle } from '../apis/delete/delete_vehicle';
import { assign_pilot } from '../apis/post/assign_pilot';
import { remove_assigned_pilot } from '../apis/post/remove_assigned_vehicle';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap:12px;
  justify-content: flex-end;
  width: 100%;
`;
const RowContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  gap:20px;
`;
const ColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap:12px;
`;

const FeatureContainer = styled.div`

  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  box-shadow: 0px 0px 20px rgba(94, 98, 120, 0.04);
  border-radius: 12px;
  cursor: pointer;
  background-color: #c9f7f5; 
`;

const PilotContainer = styled.div`

  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  box-shadow: 0px 0px 20px rgba(94, 98, 120, 0.04);
  border-radius: 12px;
  cursor: pointer;
  background-color: #c9f7f5; 
`;
const Text1 = styled.div`
font-size: 16px;
font-weight: 700;
color: #1bc5bd;
`;
const Text2 = styled.div`
font-size: 12px;
font-weight: 500;
color: #1bc5bd;
`;

const BigNumber = styled.div`
font-size: 36px;
font-weight: 700;
color: #1bc5bd;
`;
const GreenButton = styled.div`
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

const AdminDashboard = () => {
const [isAddPilotModalOpen, setIsAddPilotModalOpen] = useState(false);
const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
const [isAssignModalOpen, setIsAssignPilotModalOpen] = useState(false);

const [formData, setFormData] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [pilots, setPilots] = useState([]);
const [optionsPilots, setOptionsPilots] = useState([]);
const [vehicles, setVechiles] = useState([]);

const [devices, setDevices] = useState([]);
const dispatch = useDispatch();  
const storeDevices = useSelector((state)=>state.devices);
const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
}
const handlePilotCancel = () => {
    setIsAddPilotModalOpen(false);
};

const handleVehicleCancel = () => {
    setIsAddVehicleModalOpen(false);
};

const handleAssignPilotCancel = () => {
    setIsAssignPilotModalOpen(false);
};

const addPilot = () => {
    setFormData({});
    setIsAddPilotModalOpen(true);
}

const addVehicle = () => {
    setFormData({});
    setIsAddVehicleModalOpen(true);
}

const assignPilotModal = (_id) => {
    setFormData({
        "vehicleId":_id
    });
    setIsAssignPilotModalOpen(true);
}

const validatedataAndCreate = async () => {
    if(formData.email === undefined || formData.email === null || formData.email === '' ||
        formData.phone_no === undefined || formData.phone_no === null || formData.phone_no === '' ||
        formData.password === undefined || formData.password === null || formData.password === '' ||
        formData.confirmPassword === undefined || formData.confirmPassword === null || formData.confirmPassword === '' ){
        dispatch(dataAction.setAlert({type:"error", message:'Enter all details'}));
        return;
    }
    if(emailRegex.test(formData.email) && phoneRegex.test(formData.phone_no) && formData.password.length>=8  && formData.confirmPassword.length>=8 && formData.confirmPassword === formData.password){
        console.log(formData);
        setIsLoading(true);
        const pilot_data = {
            email : formData.email,
            phone_number : formData.phone_no,
            password: formData.password,
            admin: false,
        }
        const response = await create_pilot(pilot_data);
    
        if(response && (response.status === 200 || response.status === 201)){
            console.log(response);
            dispatch(dataAction.setAlert({type:"success", message:'Pilot created successfully!'}));
            await getPilots()
            setIsLoading(false);
            setIsAddPilotModalOpen(false);
        }else{
            setIsLoading(false);
        }
    }else{
        if(!emailRegex.test(formData.email))
            dispatch(dataAction.setAlert({type:"error", message:'Invalid email!'}));
        if(!phoneRegex.test(formData.phone_no))
            dispatch(dataAction.setAlert({type:"error", message:'Invalid phone number!'}));
        if(formData.password.length < 8)
            dispatch(dataAction.setAlert({type:"error", message:'Password should be of atleast 8 characters!'}));
        if(formData.confirmPassword !== formData.password)
            dispatch(dataAction.setAlert({type:"error", message:'Password did not match!'}));
        // console.log("error");
    }
}

const validateVechicleAndCreate = async () => {
    if((formData.registrationNumber!== undefined && formData.registrationNumber !== null && formData.registrationNumber.toString().trim() !== "")&&
    (formData.vehicleWheelType!==undefined)&&(formData.vehicleLoadType!==undefined)&&(formData.deviceId!==undefined)){
        setIsLoading(true);
        const data = {
            registrationNumber:formData.registrationNumber,
            vehicleLoadType:formData.vehicleLoadType,
            vehicleWheelType:formData.vehicleWheelType,
            deviceId:formData.deviceId,
        }
        const response = await add_vehicle(data);
        if(response && (response.status === 200 || response.status === 201)){
            console.log(response);
            dispatch(dataAction.setAlert({type:"success", message:'Vehicle created successfully!'}));
            await getVehicles()
            setIsLoading(false);
            setIsAddVehicleModalOpen(false);
        }else{
            setIsLoading(false);
        }
    }else{
        dispatch(dataAction.setAlert({type:"error", message:'Incomplete!'}));
    }
    console.log(formData);
}
const getPilots = async () => {
    const response = await get_all_pilots();
    if(response && (response.status === 200 || response.status === 201)){
        console.log("pilots")
        setPilots(response.data.pilots);
        let options = [];
        for(let i=0;i<response.data.pilots.length;i++){
            options.push({
                label: response.data.pilots[i].email,
                value: response.data.pilots[i]._id,
            })
        }
        setOptionsPilots(options);
    }
}

const getVehicles = async () => {
    const response = await get_all_vehicles();
    if(response && (response.status === 200 || response.status === 201)){
        console.log(response)
        setVechiles(response.data.vehicles);
    }
}

const assignPilot = async () => {
    if((formData.userId!== undefined || formData.userId !== null || formData.userId!=="")&&(formData.vehicleId!== undefined || formData.vehicleId !== null || formData.vehicleId!=="")){
        setIsLoading(true);
        const data = {...formData};
        const response = await assign_pilot(data);
        if(response && (response.status === 200 || response.status === 201)){
            console.log(response);
            await getVehicles()
            setIsLoading(false);
            setIsAssignPilotModalOpen(false);
        }else{
            setIsLoading(false);
        }
    }
    console.log(formData);
}

useEffect(() => {
    getPilots();
}, [])

useEffect(() => {
    getVehicles();
}, [])

const removeVehicle = async (id) => {
    const response = await delete_vehicle(id);
    if(response && (response.status === 200 || response.status === 201)){
        console.log("removed")
        getVehicles();
    }
}

const removeAssignPilot = async (userId, vehicleId) => {
    if((userId!==null ||userId!== undefined || userId!=="") &&(vehicleId!==null ||vehicleId!== undefined ||vehicleId!=="")){
        const data = {
            userId:userId, vehicleId:vehicleId
        };
        const response = await remove_assigned_pilot(data);
        console.log(response)
        if(response && (response.status === 200 || response.status === 201 || response.status === 204)){
            console.log("removed")
            getVehicles();
        }
    }
   
}

useEffect(()=>{
    let k =[];
    for(let i=0;i<storeDevices.length;i++){
        k.push({
            label: storeDevices[i].device_name,
            value: storeDevices[i]._id,
        })
    }
    setDevices(k);
},[storeDevices])

const filterOption = (input, option) =>
(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Container>
        <Modal width={360} title="Add Pilot" footer={null} open={isAddPilotModalOpen} onCancel={handlePilotCancel}>
            <Spin spinning={isLoading}>
                <ColContainer style={{ alignItems:'center' }}>
                    <div/>
                    <TextField id="email" value={formData.email || ''} onChange={handleChange} name="email" placeholder="email"/>
                    <TextField id="phone_no" value={formData.phone_no || ''} type="text" maxLength={10} onChange={handleChange} name='phone_no' placeholder="phone no"/>
                    <TextField id="password" value={formData.password || ''} type="password" onChange={handleChange} name='password' placeholder="password"/>
                    <TextField id="confirmPassword" value={formData.confirmPassword || ''} type="password" onChange={handleChange} name='confirmPassword' placeholder="confirm password"/>
                    <div/>
                    <GreenButton onClick={validatedataAndCreate}>Add +</GreenButton>
                </ColContainer>
            </Spin>
        </Modal>
        <Modal width={360} title="Add Vehicle" footer={null} open={isAddVehicleModalOpen} onCancel={handleVehicleCancel}>
            <Spin spinning={isLoading}>
                <ColContainer style={{ alignItems:'center' }}>
                    <div/>
                    <TextField id="registrationNumber" value={formData.registrationNumber || ''} onChange={handleChange} name="registrationNumber" placeholder="registration number"/>
                    <Select
                        placeholder="Wheel Type"
                        allowClear
                        style={{width:'100%' }}
                        onChange={(value)=>{
                            setFormData(values => ({...values, ["vehicleWheelType"]: value}));
                        }}
                        filterOption={filterOption}
                        showSearch
                        optionFilterProp="children"
                        options={[
                            { value: 2, label: '2' },
                            { value: 3, label: '3' },
                            { value: 4, label: '4' },
                          ]}
                        />
                    <Select
                        placeholder="Load Type"
                        allowClear
                        style={{width:'100%' }}
                        onChange={(value)=>{
                            setFormData(values => ({...values, ["vehicleLoadType"]: value}));
                        }}
                        filterOption={filterOption}
                        showSearch
                        optionFilterProp="children"
                        options={[
                            { value: false, label: 'Light' },
                            { value: true, label: 'Heavy' },
                          ]}
                        />
                    <Select
                        placeholder="Device"
                        allowClear
                        style={{width:'100%' }}
                        onChange={(value)=>{
                            setFormData(values => ({...values, ["deviceId"]: value}));
                        }}
                        filterOption={filterOption}
                        showSearch
                        optionFilterProp="children"
                        options={devices}
                        />
                    <div/>
                    <GreenButton onClick={validateVechicleAndCreate}>Add +</GreenButton>
                </ColContainer>
            </Spin>
        </Modal>
        <Modal width={360} title="Assign Pilot" footer={null} open={isAssignModalOpen} onCancel={handleAssignPilotCancel}>
            <Spin spinning={isLoading}>
                <ColContainer style={{ alignItems:'center' }}>
                    <div/>
                    <Select
                        placeholder="Pilots"
                        allowClear
                        style={{width:'100%' }}
                        onChange={(value)=>{
                            setFormData(values => ({...values, ["userId"]: value}));
                        }}
                        filterOption={filterOption}
                        showSearch
                        optionFilterProp="children"
                        options={optionsPilots}
                        />
                    <div/>
                    <GreenButton onClick={assignPilot}>Assign</GreenButton>
                </ColContainer>
            </Spin>
        </Modal>
        <RowContainer>
            <GreenButton onClick={addPilot}>Add Pilot +</GreenButton>
            <GreenButton onClick={addVehicle}>Add Vehicle +</GreenButton>
        </RowContainer>
        <RowContainer style={{justifyContent:'flex-start'}}>
            <FeatureContainer>
                <RowContainer2>
                    <ColContainer>
                        <BigNumber>24</BigNumber>
                        <SmallTwo children="Vehicles" style={{color:'#1bc5bd'}}/>
                    </ColContainer>
                    <Progress strokeColor={'#1bc5bd'} type="dashboard" percent={50} strokeWidth={12} size={75}/>
                </RowContainer2>
                <SmallThree children={`Total ${vehicles.length}`}></SmallThree>
            </FeatureContainer>
            <FeatureContainer>
                <RowContainer2>
                    <ColContainer>
                        <BigNumber>14</BigNumber>
                        <SmallTwo children="Pilots" style={{color:'#1bc5bd'}}/>
                    </ColContainer>
                    <Progress strokeColor={'#1bc5bd'} type="dashboard" percent={67} strokeWidth={12} size={75}/>
                </RowContainer2>
                <SmallThree children={`Total ${pilots.length}`}></SmallThree>
            </FeatureContainer>
        </RowContainer>
        <SmallOne style={{marginTop: '14px'}}>Pilots</SmallOne>
        <RowContainer style={{justifyContent:'flex-start', marginTop: '10px'}}>
            {
                pilots.map((item,index)=>(
                    <PilotContainer key={index}>
                        <Text1>Email: {item.email}</Text1>
                        <Text2>Phn no.: {item.phone_number}</Text2>
                        <SmallThree onClick={()=>{}} style={{marginTop:'12px', cursor:'pointer'}}>Remove</SmallThree>
                    </PilotContainer>
                ))
            }
        </RowContainer>
        <SmallOne style={{marginTop: '14px'}}>Vehicles</SmallOne>
        <RowContainer style={{justifyContent:'flex-start', marginTop: '10px'}}>
            {
                vehicles.map((item,index)=>(
                    <PilotContainer key={index}>
                        <Text1>Reg. No: {item.registrationNumber}</Text1>
                        <Text2>Load Type: {item.vehicleLoadType ? "Heavy" : "Light"}</Text2>
                        <Text2>Wheel Type: {item.vehicleWheelType}</Text2>
                        {item.linkedPilots.map((p, iindex)=>(
                            <RowContainer key={iindex}>
                                <Text2>Pilot {iindex+1}: {p.email}</Text2>
                                <SmallThree onClick={()=>removeAssignPilot(p._id, item._id)}>Remove</SmallThree>
                            </RowContainer>
                        ))}
                        <SmallThree onClick={()=>removeVehicle(item._id)} style={{marginTop:'12px', cursor:'pointer'}}>Del</SmallThree>
                        <SmallThree onClick={()=>assignPilotModal(item._id)} style={{marginTop:'12px', cursor:'pointer'}}>Assign Pilot</SmallThree>
                    </PilotContainer>
                ))
            }
        </RowContainer>
    </Container>
  )
}

export default AdminDashboard