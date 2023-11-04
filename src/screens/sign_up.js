import React from 'react'
import styled from 'styled-components'
import SmallOne from '../components/smallOne';
import TextField from '../components/TextField';
import { BiSolidCarBattery } from "react-icons/bi";
import SmallTwo from '../components/smallTwo';

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
const SignUpContainer = styled.div`
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

const SignUp = () => {
  return (
    <Container>

        <SignUpContainer>
            <Heading >Cell Doc <BiSolidCarBattery/></Heading>
            <SmallTwo style={{ color: '#9BBEC8' }}>Create an account</SmallTwo>
            <TextField placeholder="email"/>
            <TextField placeholder="mobile no"/>
            <TextField placeholder="password"/>
            <TextField placeholder="confirm password"/>
            <SizedBox/>
            <GreenButton>Sign Up</GreenButton>
        </SignUpContainer>
    </Container>
  )
}

export default SignUp