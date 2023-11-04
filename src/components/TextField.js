import React from 'react'
import styled from 'styled-components'

const CustomInput = styled.input`
display: flex;
border: none;
width: 100%;
&:focus {
    outline: none !important;
}
`;

const Container = styled.div`
display: flex;
flex-direction: row;
padding: 8px 12px;
max-width: 340px;
width: 100%;
border : 1px solid #9BBEC8;
border-radius : 8px;
background-color: #fff;
`;
const TextField = (props) => {
    
  return (
    <Container>
        <CustomInput placeholder={props.placeholder} onChange={props.onChange}/>
    </Container>
  )
}

export default TextField