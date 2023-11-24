import React, {useState} from 'react'
import styled from 'styled-components'
import SmallOne from '../components/smallOne';
import TextField from '../components/TextField';
import { BiSolidCarBattery } from "react-icons/bi";
import SmallTwo from '../components/smallTwo';
import { usernameValidator } from '../helpers/utils';
import { emailRegex } from '../config';
import { initiate_forgot_password } from '../apis/post/initiate_forgot_password';
import { useDispatch } from 'react-redux';
import { dataAction } from '../store';
import { finish_forgot_password } from '../apis/post/finish_forgot_password';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    background-color: #282733;
`;
const GreenButton = styled.div`
margin-top: auto;
margin-left: 8px;
display: flex;
padding: 8px 24px;
background-color: #282733;
border-radius: 6px;
color: #fff;
width: 120px;
cursor:pointer;
font-family: Poppins;
font-size: 12px;
justify-content: center;
align-items: center;
font-weight : 700;
&:hover{
  opacity: 0.75;
}
`;
const ForgotPasswordContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin : auto;
    align-items: center;
    padding : 24px 32px 12px 32px;
    border-radius : 12px;
    background-color: #fff;
    gap: 12px;
    width : 360px;
  `;
  const SizedBox = styled.div`
  display: flex;
  height: 6px;
`;
const SpinContainer = styled.div`
    width: 400px;
    margin: auto;
`;
const Heading = styled.div`
display: flex;
flex-direction: row;
font-family: Poppins;
font-size: 24px;
justify-content: center;
align-items: center;
font-weight : 600;
text-align: center;
gap:12px;
`;
const Text = styled.div`
font-family: Poppins;
font-size: 12px;
justify-content: center;
align-items: center;
font-weight : 600;
text-align: center;
color: #9BBEC8;
`;


const ForgotPassword = () => {
    
    const [isEmailStage, setIsEmailStage ] = useState(true);
    const [formData, setFormData] = useState({})  ;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(values => ({...values, [name]: value}));
      }
     
    const continueButton = async () => {
        if(emailRegex.test(formData.email)){
            setLoading(true);
            const data = {
                email: formData.email
            };
            const response = await initiate_forgot_password(data);
            console.log(response);
            if(response && response.status == 200)
                setIsEmailStage(false);
            setLoading(false);
        }else{
            dispatch(dataAction.setAlert({type:"error", message:'Invalid email!'}));

            console.log("error");
        }
    }
    const changePassword = async () => {
        if(formData.otp.length === 6 && formData.password.length>=8  && formData.confirm_password.length>=8 && formData.confirm_password === formData.password){
            setLoading(true);
            const data = {
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirm_password,
                otp: formData.otp
            };
            console.log(data);
            const response = await finish_forgot_password(data);
            console.log(response);
            if(response && response.status == 200){
                console.log(response);
                setLoading(false);
                navigate('/dashboard');
            }else{
                setLoading(false);
            }
                
        }else{
            console.log("error");
            if(formData.otp.length !== 6)
                dispatch(dataAction.setAlert({type:"error", message:'Invalid otp!'}));
            if(formData.password.length < 8)
                dispatch(dataAction.setAlert({type:"error", message:'Password should be of atleast 8 characters!'}));
            if(formData.confirm_password !== formData.password)
                dispatch(dataAction.setAlert({type:"error", message:'Password did not match!'}));
        }
    }
  return (
    <Container>
        <SpinContainer>
            <Spin spinning={loading}>
        {
            isEmailStage?
            <ForgotPasswordContainer>
                <Heading >Cell Doc <BiSolidCarBattery/></Heading>
                <div/>
                <TextField id="email" value={formData.email || ''} onChange={handleChange} name="email" placeholder="email"/>
                <SizedBox/>
                <GreenButton onClick={continueButton}>Continue</GreenButton>
            </ForgotPasswordContainer>
            :<ForgotPasswordContainer>
            <Heading >Cell Doc <BiSolidCarBattery/></Heading>
            <Heading >Enter Verification Code</Heading>
            <Text>A 6 digit verification code has been send to the email : {formData.email}</Text>
            <div/>
            <TextField id="otp" value={formData.otp || ''} onChange={handleChange} name="otp" placeholder="6 digit code"/>
            <div/>
            <Text style={{ color: '#9BBEC8' }}>Enter a new password te reset the password on your account. We'll ask for this password whenever you log in.</Text>
            <div/>
            <TextField type="password" id="password" value={formData.password || ''} onChange={handleChange} name="password" placeholder="new password"/>
            <TextField type="password" id="confirm_password" value={formData.confirm_password || ''} onChange={handleChange} name="confirm_password" placeholder="confirm password"/>
            <SizedBox/>
            <GreenButton onClick={changePassword}>Change Password</GreenButton>
        </ForgotPasswordContainer>
        }
        </Spin>
        </SpinContainer>
    </Container>
  )
}

export default ForgotPassword