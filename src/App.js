
import './App.css';
import Dashboard from './screens/Dashboard/dashboard';
import { Routes, Route } from "react-router-dom";
import ImportData from './screens/import_data';
import SignUp from './screens/sign_up';
import Login from './screens/login';
import OTP from './screens/otp';
import ChangePassword from './screens/change_password';
import ForgotPassword from './screens/forgot_password';
function App() {
  return (
    <Routes>
      <Route path='/' element={<ChangePassword/>}/>
      <Route path='/import' element={<ImportData/>}/>
    </Routes>
  );
}

export default App;
