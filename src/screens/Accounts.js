import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import SmallTwo from '../components/smallTwo';
import TextField from '../components/TextField';
import { FaUserEdit } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { save_profile } from '../apis/post/save_profile';
import store, { dataAction } from '../store';
import { Spin } from 'antd';
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
width: 72px;
height: 72px;
border-radius: 50%;
display: flex;
flex-direction: row;
justify-content: center;
align-items: flex-end;
overflow: hidden;
`;

const EditImage = styled.div`
width: 64px;
height: 28px;
border-radius: 0 0 50% 50%;
background-color: rgba(0,0,0,.4);
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
    driving_license: 'GBL7868HN'
}
let test = true;
const Accounts = () => {
const profile = useSelector((state) => state.profile);  
const [editing, setEditing] = useState(false);
const [formData, setFormData] = useState({});
const [isSaving, setIsSaving] = useState(false);
const [file, setFile] = useState(null);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
  }

  const handleCreateProfile = ()=>{
    // test = false;
    // setFormData({
    //     phone_number: profile.phone_number ?? null,
    //     email: profile.email ?? null,
    //     first_name: profile.first_name ?? null,
    //     last_name: profile.last_name ?? null,
    //     address: profile.address ?? null,
    //     drivingLicense: profile.drivingLicense ?? null
    // });
    setFormData(profile);
    setEditing(true);
  }

  const handleEditing = () => {
    setEditing(true);
    setFormData(profile);
  }

  const saveProfile = async () => {
    // setIsSaving(true);
    const profileData = JSON.parse(JSON.stringify(formData));
    delete profileData?.profile_pic;
    delete profileData?._id;
    delete profileData?.__v;
    for(const key in profileData){
        if(profileData[key] === undefined || profileData[key] === null || profileData[key].toString().trim() === ""){
            delete profileData[key];
        }
    }
    
    if(file){
        profileData.file = URL.createObjectURL(file);
        profileData.file_name = file.name;
    }
   

    // const form = new FormData();
    

    const response = await save_profile(profileData);
    if(response && (response.status === 200 || response.status === 201)){
        console.log(response);
        store.dispatch(dataAction.setProfile(response.data.profile));
        setIsSaving(false);
        setEditing(false);
        store.dispatch(dataAction.setAlert({type:'success', message: 'Profile updated' }));
    }
  }
  

  

  const handleImageChange = (e) => {
    console.log(e.target.files);
    let image = e.target.files[0];
    if(image){
        console.log(image);
        setFile(image);
    }
  }
 
  return (
    <ColContainer style={{ padding: 24}}>
        <Spin spinning={isSaving}>
            { !profile.hasOwnProperty('first_name') && editing===false?
            <ColContainer style={{ alignItems:'center', marginTop: '60px' }}>
                <FaUserEdit size={80} color={"#c9f7f5"}/>
                <GreenButton onClick={handleCreateProfile}>Create Profile +</GreenButton> 
            </ColContainer>
            :
            <div>
                <FeatureContainer>
                    <RowContainer style={{ justifyContent: 'space-between'}}>
                        <RowContainer>
                            <CircularUserImaga style={{
                                backgroundImage: file? `url("${URL.createObjectURL(file)}")` : '',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }}>
                                {editing && <EditImage onClick={()=>{
                                    document.getElementById('uploadProfilePic')?.click();
                                }}>
                                    <AiFillEdit fontSize={20} color="#fff"/>
                                    
                                </EditImage>}
                            </CircularUserImaga>
                            <input onChange={handleImageChange} type="file" accept='image/*' id="uploadProfilePic" hidden/>
                            <NameText style={{ color: 'grey' }}>{`${profile.first_name ?? ''} ${profile.last_name ?? ''}`}</NameText>
                        </RowContainer>
                        {!editing && <GreenButton onClick={handleEditing}>Edit</GreenButton>}
                    </RowContainer>
                </FeatureContainer>
                <SizedBox/>
                <FeatureContainer>
                    <ColContainer>
                        <RowContainer style={{ justifyContent: 'space-between'}}>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>First Name *</SmallTwo>
                                { !editing? <DataContainer>{profile.first_name ?? ''}</DataContainer> :
                                <TextField id="first_name" name="first_name" value={formData.first_name || ''} placeholder="First Name" type="text" onChange={handleChange}/>}
                            </ColContainer>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>Last Name</SmallTwo>
                                { !editing? <DataContainer>{profile.last_name ?? ''}</DataContainer> :
                                <TextField id="last_name" name="last_name" value={formData.last_name || ''} placeholder="Last Name" type="text" onChange={handleChange}/>}
                            </ColContainer>
                        </RowContainer>
                        <RowContainer style={{ justifyContent: 'space-between'}}>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>Email *</SmallTwo>
                                <DataContainer>{profile.email??''}</DataContainer>
                            </ColContainer>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>Phone no *</SmallTwo>
                                <DataContainer>{profile.phone_number??''}</DataContainer>
                            </ColContainer>
                        </RowContainer>
                        <RowContainer style={{ justifyContent: 'space-between'}}>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>Address *</SmallTwo>
                                { !editing? <DataContainer>{profile.address ??''}</DataContainer>:
                                <TextField id="address" name="address" value={formData.address || ''} placeholder="Address" type="text" onChange={handleChange}/>}
                            </ColContainer>
                            <ColContainer>
                                <SmallTwo style={{ color: 'grey' }}>Driving License</SmallTwo>
                                { !editing? <DataContainer>{profile.driving_license ??''}</DataContainer>:
                                <TextField id="driving_license" name="driving_license" value={formData.driving_license || ''} placeholder="Driving License" type="text" onChange={handleChange}/>}
                            </ColContainer>
                        </RowContainer>
                    </ColContainer>
                </FeatureContainer>
                <SizedBox/>
                { editing && <RowContainer style={{justifyContent:'flex-end'}}>
                    <GreenButton onClick={saveProfile}>Save</GreenButton>
                </RowContainer> }    
            </div>}
        </Spin>
    </ColContainer>
  )
}

export default Accounts