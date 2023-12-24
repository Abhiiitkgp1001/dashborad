
import './App.css';
import Dashboard from './screens/Dashboard/dashboard';
import { Routes, Route } from "react-router-dom";
import ImportData from './screens/import_data';
import SignUp from './screens/sign_up';
import Login from './screens/login';
import OTP from './screens/otp';
import ChangePassword from './screens/change_password';
import ForgotPassword from './screens/forgot_password';
import ToastContaier from './components/ToastContaier';
import ProtectedRoute from './components/protectedRoute';
import Home from './screens/Home';
import ProtectedRouteEarlier from './components/ProtectedRouteEarlier';
function App() {
  return (
   <ToastContaier>
     <Routes>
      <Route path='/' element={<ProtectedRouteEarlier children={<SignUp/>} to='/home'/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path='/home' element={<ProtectedRoute children={<Home/>} to="/"/>}/>
      <Route path='/import' element={<ImportData/>}/>
    </Routes>
   </ToastContaier>
  );
}

export default App;
