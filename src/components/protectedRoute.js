import { Spin } from "antd";
import React, {useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
const Container = styled.div`
background: linear-gradient(#141e30, #243b55);
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
`;
const ProtectedRoute = (props) => {
   const [validation, setValidation] = useState(null);
   const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        setValidation(true);
    }else{
        setValidation(false);
    }
    setLoading(false);
  },[])
  return loading ? 
  <Container >
    <Spin size="large"/>
  </Container>
  : validation ? <div>{props.children}</div> : <Navigate to='/' />;
};

export default ProtectedRoute;