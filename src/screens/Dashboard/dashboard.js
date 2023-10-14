import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import VITGraph from "../../components/Graphs/Graphs";
import { dataAction } from "../../store";
import Customers from "../Boards";
import VpBoard from "../headerRow";
import "./dashboard.scss";
import { BsFillGridFill, BsFillPlusCircleFill, BsList } from "react-icons/bs";

const AddGraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px auto;
  padding: 10px;
  width: 80vw;
  background-color: #fff;
  border-radius: 12px;
`;
const SizedBox = styled.div`
    display: flex;
    flex-direction: column;
    height:16px;  
`;
const GreenButton = styled.div`
  margin-top: auto;
  display: flex;
  padding: 8px 16px;
  background-color: #c9f7f5;
  border-radius: 6px;
  color: #000;
  cursor: pointer;
  font-family: Poppins;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  &:hover {
    color: #fff;
    background-color: #774360;
    opacity: 0.75;
  }
`;

const PaddingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  padding: 100px;
  width: 80vw;
`;

const AppContainer = styled.div`
  background-color: rgb(213, 217, 226, 0.2);
  height: 100vh;
`;

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [count, setCount] = useState(0); // Counter for generating unique keys.
  const dispatch = useDispatch();
  const [listView, setListView] = useState(false);

  const addComponent = () => {
    setComponents((prevComponents) => {
      // console.log("before adding " + prevComponents);
      const newComponent = (
        <VITGraph
          key={count}
          graphId={count}
          componentKey={count}
          onRemove={() => removeComponent(count)} // Pass a remove function as a prop.
        />
      ); // Pass the value as a prop.
      setCount(count + 1); // Increment the counter for the next key.
      return [...prevComponents, newComponent];
    });
  };
  //remove component logic here
  const removeComponent = (keyToRemove) => {
    setComponents((prevComponents) => {
      // console.log("before removing " + prevComponents);
      const updatedComponents = prevComponents.filter((component) => {
        const componentKey = component.key;
        // console.log("Removing component Key" + componentKey);
        // console.log("Component to remove ", keyToRemove);
        return componentKey !== keyToRemove + "";
      });
      // console.log("after removing", updatedComponents);
      dispatch(dataAction.setTempChartData({ id: keyToRemove, data: null }));
      dispatch(dataAction.setVoltageChartData({ id: keyToRemove, data: null }));

      return [...updatedComponents];
    });
  };
  const layout = {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
  };
  // console.log("component before adding any graph ", components);

  useEffect(() => {}, [listView])
  return (
    <AppContainer>
      <Layout>
        <VpBoard />
        <Customers />
        <div>
          <AddGraphContainer>
            <GreenButton onClick={addComponent}> <BsFillPlusCircleFill /> &nbsp; Add New Graph</GreenButton>
            <GreenButton style={{
              color: listView? "#fff" :"#000",
              backgroundColor: listView? "#774360" :"#c9f7f5",
            }} onClick={() => setListView(true)}>
              <BsList />
              &nbsp; List View
            </GreenButton>
            <GreenButton style={{
              color: !listView? "#fff" :"#000",
              backgroundColor: !listView? "#774360" :"#c9f7f5",
            }} onClick={() => setListView(false)}>
              <BsFillGridFill /> &nbsp; Grid View
            </GreenButton>
          </AddGraphContainer>
          <SizedBox/>
          <div id="component-container">
            {components.map((component, index) => (
              <div key={index} className={listView ? "chartInList" : "chart"}>
                {component}
              </div>
            ))}
          </div>
        </div>

        <PaddingContainer />
      </Layout>
    </AppContainer>
  );
};

export default Dashboard;
