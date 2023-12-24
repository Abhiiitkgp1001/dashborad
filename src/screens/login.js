import React,{useState} from 'react'
import styled from 'styled-components'
import { Spin } from 'antd';
import TextField from '../components/TextField';
import { BiSolidCarBattery } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { sign_in } from '../apis/post/sign_in';
import SmallThree from '../components/smallThree';
import { usernameValidator } from '../helpers/utils';
import { useDispatch } from 'react-redux';
import { dataAction } from '../store';

const SpinContainer = styled.div`
    width: 400px;
    margin: auto;
`;
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
const LoginContainer = styled.div`
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

const Login = (props) => {
  const [formData, setFormData] = useState({})  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}));
  }

  const signIn = async () => {
    if(formData.username === undefined || formData.username === null || formData.username === '' ||
        formData.password === undefined || formData.password === null || formData.password === '' ){
        dispatch(dataAction.setAlert({type:"error", message:'Enter all details'}));
        return;
    }
    if(usernameValidator(formData.username) && formData.password.length >= 8){
        setLoading(true);
        const user_data= {
            user_name : formData.username,
            password : formData.password,
        };
        console.log(user_data);
        const response = await sign_in(user_data);
        console.log(response);
        if(response && response.status == 200){
            setLoading(false);
            dispatch(dataAction.setUserData({user_id: response.data.userId, token: response.data.token }));
            navigate('/home');
        }else{
            if(!usernameValidator(formData.username))
            dispatch(dataAction.setAlert({type:"error", message:'Invalid username!'}));
        if(formData.password.length < 8)
            dispatch(dataAction.setAlert({type:"error", message:'Password should be of atleast 8 characters!'}));
            setLoading(false);
        }

    }else{
      if(!usernameValidator(formData.username)){
        dispatch(dataAction.setAlert({type:"error", message:'Invalid Username'}));
      }else if(formData.password.length < 8){
        dispatch(dataAction.setAlert({type:"error", message:'Invalid Password'}));
      }
        
    }
  }
  return (
    <Container>
        <SpinContainer>
            <Spin spinning={loading}>
        <LoginContainer>
            <Heading >Cell Doc <BiSolidCarBattery/></Heading>
            <div/>
            <TextField id="username" value={formData.username || ''} onChange={handleChange} name="username" placeholder="email/phone no"/>
            <TextField id="password" value={formData.password || ''} type="password" onChange={handleChange} name='password' placeholder="password"/>
            <SmallThree onClick={()=> navigate('/forgotpassword')} style={{cursor:'pointer'
                    }}>Forgot password</SmallThree>
            <SizedBox/>
            <GreenButton onClick={signIn}>Login</GreenButton>
            
            <SmallThree>Don't have an account? <span onClick={()=>props.setIsSignIn(false) } style={{
                        color: "#282733", cursor:'pointer'
                    }}>Sign Up</span></SmallThree>
        </LoginContainer>
        </Spin>
        </SpinContainer>
    </Container>
  )
}

export default Login