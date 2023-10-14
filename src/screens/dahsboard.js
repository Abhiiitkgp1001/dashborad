
import VpBoard from './headerRow';
import { Layout} from 'antd';
import styled from 'styled-components';
import Customers from './Boards';
import { Outlet } from "react-router-dom";



const Dashboard = ()=>{

 
  const AppContainer = styled.div`
    background-color: rgb(213, 217, 226,0.2);
    height: 100vh;
  `;

  return (
    <AppContainer>
       <Layout >
        <VpBoard/>
    
        <Customers/>
        <Outlet/>
      </Layout>
      
      
    </AppContainer>
  );
}

export default Dashboard;
