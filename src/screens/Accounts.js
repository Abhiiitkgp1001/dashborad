import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import SmallTwo from '../components/smallTwo';
import TextField from '../components/TextField';
import { FaUserEdit } from "react-icons/fa";

const RowContainer = styled.div`
display: flex;
flex-direction: row;
gap:12px;
align-items: center;
justify-content: flex-start;
width: 100%;
`;
const ColContainer = styled.div`
display: flex;
flex-direction: column;
gap:12px;
justify-content: flex-start;
width: 100%;
`;
const FeatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  box-shadow: 0px 0px 20px rgba(94, 98, 120, 0.04);
  border-radius: 12px;
  cursor: pointer;
  background-color: #fff; 
`;
const CircularUserImaga = styled.div`
width: 48px;
height: 48px;
border-radius: 50%;
background-color: #bbb;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`;
const NameText = styled.div`
font-size: 24px;
font-weight: 600;
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
const SizedBox = styled.div`
    display: flex;
    height: 16px;
`;
const DataContainer = styled.div`
display: flex;
flex-direction: row;
padding: 8px 12px;
max-width: 340px;
width: 100%;
border : 1px solid #c9f7f5;
border-radius : 8px;
font-size: 13px;
background-color: #c9f7f5;
box-sizing: border-box;
opacity: 0.65;
`;
const data = {
    first_name: "Akshay",
    last_name: "Kumar",
    email: 'akshay@gmail.com',
    phone_no: '9878778877',
    address: 'VS HALL, IIT Kharagpur, Kharagpur, West Bengal, 721320',
    drivingLicense: 'GBL7868HN'
}
let test = true;
const Accounts = () => {
const [editing, setEditing] = useState(false);
const [formData, setFormData] = useState(data);
const profile = useSelector((state) => state.profile);  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
  }

  const handleCreateProfile = ()=>{
    test = false;
    setFormData({});
    setEditing(true);
  }
  return (
    <ColContainer style={{ padding: 24}}>
        { profile === null && test ?
        <ColContainer style={{ alignItems:'center', marginTop: '60px' }}>
            <FaUserEdit size={80} color={"#c9f7f5"}/>
            <GreenButton onClick={handleCreateProfile}>Create Profile +</GreenButton> 
        </ColContainer>
        :
        <div>
            <FeatureContainer>
                <RowContainer style={{ justifyContent: 'space-between'}}>
                    <RowContainer>
                        <CircularUserImaga/>
                        <NameText style={{ color: 'grey' }}>{`${data.first_name} ${data.last_name}`}</NameText>
                    </RowContainer>
                    {!editing && <GreenButton onClick={()=>setEditing(!editing)}>Edit</GreenButton>}
                </RowContainer>
            </FeatureContainer>
            <SizedBox/>
            <FeatureContainer>
                <ColContainer>
                    <RowContainer style={{ justifyContent: 'space-between'}}>
                        <ColContainer>
                            <SmallTwo>First Name</SmallTwo>
                            { !editing? <DataContainer>{data.first_name}</DataContainer> :
                            <TextField id="first_name" name="first_name" value={formData.first_name || ''} placeholder="First Name" type="text" onChange={handleChange}/>}
                        </ColContainer>
                        <ColContainer>
                            <SmallTwo>Last Name</SmallTwo>
                            { !editing? <DataContainer>{data.last_name}</DataContainer> :
                            <TextField id="last_name" name="last_name" value={formData.last_name || ''} placeholder="Last Name" type="text" onChange={handleChange}/>}
                        </ColContainer>
                    </RowContainer>
                    <RowContainer style={{ justifyContent: 'space-between'}}>
                        <ColContainer>
                            <SmallTwo>Email</SmallTwo>
                            { !editing? <DataContainer>{data.email}</DataContainer>:
                            <TextField id="email" name="email" value={formData.email || ''} placeholder="Email" type="email" onChange={handleChange}/>}
                        </ColContainer>
                        <ColContainer>
                            <SmallTwo>Phone no</SmallTwo>
                            { !editing? <DataContainer>{data.phone_no}</DataContainer>:
                            <TextField id="phone_no" name="phone_no" value={formData.phone_no || ''} placeholder="Phone No" type="text" onChange={handleChange}/>}
                        </ColContainer>
                    </RowContainer>
                    <RowContainer style={{ justifyContent: 'space-between'}}>
                        <ColContainer>
                            <SmallTwo>Address</SmallTwo>
                            { !editing? <DataContainer>{data.address}</DataContainer>:
                            <TextField id="address" name="address" value={formData.address || ''} placeholder="Address" type="text" onChange={handleChange}/>}
                        </ColContainer>
                        <ColContainer>
                            <SmallTwo>Driving License</SmallTwo>
                            { !editing? <DataContainer>{data.drivingLicense}</DataContainer>:
                            <TextField id="drivingLicense" name="drivingLicense" value={formData.address || ''} placeholder="Driving License" type="text" onChange={handleChange}/>}
                        </ColContainer>
                    </RowContainer>
                </ColContainer>
            </FeatureContainer>
            <SizedBox/>
            { editing && <RowContainer style={{justifyContent:'flex-end'}}>
                <GreenButton onClick={()=> setEditing(false)}>Save</GreenButton>
            </RowContainer> }    
        </div>}
    </ColContainer>
  )
}

export default Accounts