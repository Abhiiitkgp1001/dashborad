import { Layout } from "antd";
import styled from "styled-components";
import VITGraph from "../components/Graphs";
import Customers from "./Boards";
import VpBoard from "./headerRow";

const Dashboard = () => {
  const AppContainer = styled.div`
    background-color: rgb(213, 217, 226, 0.2);
    height: 100vh;
  `;

  return (
    <AppContainer>
      <Layout>
        <VpBoard />

        <Customers />
        <VITGraph />
      </Layout>
    </AppContainer>
  );
};

export default Dashboard;
