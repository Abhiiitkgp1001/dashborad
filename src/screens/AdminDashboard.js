import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import Heading from '../components/heading';
import PieChart from '../components/PieChart';
import SmallTwo from '../components/smallTwo';
import { Progress, Modal, Spin } from 'antd';
import SmallOne from '../components/smallOne';
import SmallThree from '../components/smallThree';
import TextField from '../components/TextField';
import { emailRegex, phoneRegex } from '../config';
import { create_pilot } from '../apis/post/create_pilot';
import { useDispatch, useSelector } from 'react-redux';
import { dataAction } from '../store';
import { get_all_pilots } from '../apis/get/get_all_pilots';
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
const [formData, setFormData] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [pilots, setPilots] = useState([]);
const dispatch = useDispatch();  
const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
}
const handleCancel = () => {
    setIsAddPilotModalOpen(false);
};
const addPilot = () => {
    setFormData({});
    setIsAddPilotModalOpen(true);
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

const getPilots = async () => {
    const response = await get_all_pilots();
    if(response && (response.status === 200 || response.status === 201)){
        setPilots(response.data.pilots ?? []);
    }
}

useEffect(() => {
    getPilots();
}, [])


  return (
    <Container>
        <Modal width={360} title="Add Pilot" footer={null} open={isAddPilotModalOpen} onCancel={handleCancel}>
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
        <RowContainer>
            <GreenButton onClick={addPilot}>Add Pilot +</GreenButton>
            <GreenButton>Add Vehicle +</GreenButton>
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
                <SmallThree children="Total 47"></SmallThree>
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
    </Container>
  )
}

export default AdminDashboard