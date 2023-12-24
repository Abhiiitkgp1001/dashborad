import React from 'react'
import styled from "styled-components";
import { Row,Dropdown } from 'antd';
import { FaUser } from "react-icons/fa6";
import store, { dataAction } from '../store';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
padding: 24px 20px;
`;
const HeaderLogo = styled.img`
width: 187px;
height: 35px;
`;
const HeaderText = styled.div`
font-size: 28px;
font-weight: 500;
color: #1bc5bd;
`;
const CircularUserImaga = styled.div`
width: 48px;
height: 48px;
border-radius: 50%;
background-color: #C9F7F5;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
cursor: pointer;
`;
const RowContainer = styled(Row)`
display: flex;
flex-direction: row;
justify-content: space-between;
flex:1;
gap: 12px;
align-items: center;
`;

const Header = (props) => {
  const navigate = useNavigate();
  const signOut = () => {
    store.dispatch(dataAction.setSignOut());
    navigate('/');
  }
  const items = [
    {
      key: '1',
      label: (
        <div onClick={signOut}>
          Sign out
        </div>
      ),
    },
  ];

  
  return (
    <Container>
        <RowContainer>
          <HeaderText>{props.heading}</HeaderText>
          <Dropdown 
            menu={{items}}
            placement="bottom"
          >
            <CircularUserImaga>
              <FaUser size={24} color='#1bc5bd'/>
            </CircularUserImaga>
          </Dropdown>
          
        </RowContainer>
        
    </Container>
  )
}

export default Header