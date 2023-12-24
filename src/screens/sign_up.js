import React,{useState} from 'react'
import styled from 'styled-components'
import SmallThree from '../components/smallThree';
import TextField from '../components/TextField';
import { BiSolidCarBattery,BiArrowBack } from "react-icons/bi";
import SmallTwo from '../components/smallTwo';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { initiate_signup } from '../apis/post/initiate_signup';
import { finish_signup } from '../apis/post/finish_signup';
import Login from './login';
import { useDispatch } from 'react-redux';
import { emailRegex, phoneRegex } from '../config';
import { dataAction } from '../store';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    background-color: #282733;
`;
const SpinContainer = styled.div`
    width: 400px;
    margin: auto;
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
const SignUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin : auto;
    align-items: center;
    padding : 24px 32px 12px 32px;
    border-radius : 12px;
    background-color: #fff;
    gap: 12px;
    box-sizing: border-box;
    width : 400px;
  `;
  const SizedBox = styled.div`
  display: flex;
  height: 6px;
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
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap:12px;
  justify-content: flex-start;
  width: 100%;
`;


const SignUp = () => {

  const [formData, setFormData] = useState({})  
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp ] = useState(true);
  const [isSignIn, setIsSignIn ] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
  }
 
  const validateInputsAndInitiateSignup = async () => {
    if(formData.email === undefined || formData.email === null || formData.email === '' ||
        formData.phone_no === undefined || formData.phone_no === null || formData.phone_no === '' ||
        formData.password === undefined || formData.password === null || formData.password === '' ||
        formData.confirmPassword === undefined || formData.confirmPassword === null || formData.confirmPassword === '' ){
        dispatch(dataAction.setAlert({type:"error", message:'Enter all details'}));
        return;
    }
    if(emailRegex.test(formData.email) && phoneRegex.test(formData.phone_no) && formData.password.length>=8  && formData.confirmPassword.length>=8 && formData.confirmPassword === formData.password){
        console.log(formData);
        setLoading(true);
        const user_data = {
            email : formData.email,
            phone_number : formData.phone_no,
        }
        const response = await initiate_signup(user_data);
    
        if(response && response.status === 200){
            console.log(response);

            setLoading(false);
            setIsSignUp(false);
        }else{
            setLoading(false);
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

  const finishSignup = async () => {
    if(formData.otp.length === 6){
        setLoading(true);
        const signup_data = {
            phone_number: formData.phone_no,
            email: formData.email,
            password: formData.password,
            admin: true,
            confirm_pass: formData.confirmPassword,
            otp: formData.otp
        };
        console.log(signup_data);
        const response = await finish_signup(signup_data);
        console.log(response); 
        if(response && response.status === 201){
            console.log(response);
            dispatch(dataAction.setUserData({user_id: response.data.userId, token: response.data.token }));
            setLoading(false);
            navigate('/home');
        }else{
            setLoading(false);
        }
    }
  }


  return (
    
    <>
    {
        isSignIn?<Login setIsSignIn={setIsSignIn }/>:<Container>
        <SpinContainer>
            <Spin spinning={loading}>
                { isSignUp? <SignUpContainer>
                
                    <Heading >Cell Doc <BiSolidCarBattery/></Heading>
                    <SmallTwo style={{ color: '#9BBEC8' }}>Create an account</SmallTwo>
                    <TextField id="email" value={formData.email || ''} onChange={handleChange} name="email" placeholder="email"/>
                    <TextField id="phone_no" value={formData.phone_no || ''} type="text" maxLength={10} onChange={handleChange} name='phone_no' placeholder="phone no"/>
                    <TextField id="password" value={formData.password || ''} type="password" onChange={handleChange} name='password' placeholder="password"/>
                    <TextField id="confirmPassword" value={formData.confirmPassword || ''} type="password" onChange={handleChange} name='confirmPassword' placeholder="confirm password"/>
                    <SizedBox/>
                    <GreenButton onClick={validateInputsAndInitiateSignup}>Sign Up</GreenButton>
                    <SmallThree>Already have an account? <span onClick={()=>setIsSignIn(true) } style={{
                        color: "#282733", cursor:'pointer'
                    }}>Sign In</span></SmallThree>
                </SignUpContainer> :
                <SignUpContainer>
                    <RowContainer><BiArrowBack onClick={()=>setIsSignUp(true)}/> </RowContainer>
                    <Heading >Cell Doc <BiSolidCarBattery/></Heading>
                    <Heading >Enter Verification Code</Heading>
                    <Text>A 6 digit verification code has been send to the email : {formData.email}</Text>
                    <div/>
                   <TextField id="otp" name="otp" maxLength={6} value={formData.otp || ''} placeholder="otp" type="password" onChange={handleChange}/>
                    <SizedBox/>
                    <GreenButton onClick={finishSignup}>Verify</GreenButton>
                </SignUpContainer>}
                
            </Spin>
        </SpinContainer>

    </Container>
    }
    </>
   
  )
}

export default SignUp