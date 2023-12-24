import React, {useState} from 'react';
import {
  AppstoreOutlined,
  CloudOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { BiSolidCarBattery } from "react-icons/bi";

import styled from 'styled-components';
import { Layout, Menu, theme } from 'antd';
import Header from '../components/Header';
import Dashboard from './Dashboard/dashboard';
import ImportData from './import_data';
import AdminDashboard from './AdminDashboard';
import Accounts from './Accounts';
const { Sider } = Layout;
const CustomSider = styled(Sider)`
overflow: auto;
height: 100vh;
position: fixed;
left: 0;
top: 0;
bottom: 0;
.ant-menu-item-selected {
  background-color: #c9f7f5;
  color: #1bc5bd;
  font-weight: 700;
}
`;
const CustomLayout = styled(Layout)`
margin-left: 200px;
background-color: white;
`;

const Heading = styled.div`
display: flex;
flex-direction: column;
font-family: Poppins;
font-size: 20px;
justify-content: center;
align-items: center;
font-weight : 600;
text-align: center;
gap: 6px;
color: white;
margin: 16px 0px;
`;
const navItems = [
  {
    label: "Dashboard",
    icon: AppstoreOutlined
  },
 
  {
    label: "Import",
    icon: CloudOutlined
  },
  {
    label: "Live Testing",
    icon: UploadOutlined
  },
  {
    label: "Account",
    icon: UserOutlined
  },
];
const items = navItems.map((item, index) => ({
  key: index,
  icon: React.createElement(item.icon),
  label: item.label,
}));

const pages = [<AdminDashboard/>, <ImportData/>, <Dashboard/>, <Accounts/>];

const Home = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handeMenuChange = (menu) => {
    setSelectedIndex(parseInt(menu.key));
  }
  return (
    <Layout hasSider>
      <CustomSider style={{ position: 'fixed', backgroundColor:'#1bc5bd' }}>
        <Heading ><BiSolidCarBattery/>Cell Doc</Heading>
        <Menu style={{backgroundColor:'#1bc5bd'}}  mode="inline" defaultSelectedKeys={['0']} items={items} onClick={handeMenuChange}/>
      </CustomSider>
      <CustomLayout>
        <Header heading={navItems[selectedIndex].label}/>
        {
          pages[selectedIndex]
        }
      </CustomLayout>
    </Layout>
  );
};
export default Home;