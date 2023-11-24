import { Spin } from "antd";
import React, {useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { verify_token } from "../apis/post/verify_token";
import { getUserData } from "../helpers/utils";
import store from "../store";
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
    validate();
  },[])

  const validate = async () => {
    let userData = getUserData();
    if(userData && userData.token!==null && userData.user_id!==null){
      const response = await verify_token({
        token: userData.token
      })
      console.log(response);
      if (response) {
          setValidation(true);
      }else{
          setValidation(false);
      }
    }else{
      setValidation(false);
    }
    setLoading(false);

  }
  return loading ? 
  <Container >
    <Spin size="large"/>
  </Container>
  : validation ? <div>{props.children}</div> : <Navigate to='/' />;
};

export default ProtectedRoute;