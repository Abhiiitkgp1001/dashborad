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
const VerificationContainer = styled.div`
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

const Text = styled.div`
font-family: Poppins;
font-size: 12px;
justify-content: center;
align-items: center;
font-weight : 600;
text-align: center;
color: #9BBEC8;
`;

const OTP = () => {
  return (
    <Container>

        <VerificationContainer>
            <Heading >Enter Verification Code</Heading>
            <Text>A 6 digit verification code has been send to the email : abhi************@gmail.com</Text>
            <div/>
            <TextField placeholder="6 digit code"/>
            <SizedBox/>
            <GreenButton>Verify</GreenButton>
        </VerificationContainer>
    </Container>
  )
}

export default OTP