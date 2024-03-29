
import './App.css';
import Dashboard from './screens/Dashboard/dashboard';
import { Routes, Route } from "react-router-dom";
import ImportData from './screens/import_data';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/import' element={<ImportData/>}/>
    </Routes>
  );
}

export default App;
