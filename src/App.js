
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
function App() {
  return (
   <ToastContaier>
     <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
      <Route path='/dashboard' element={<ProtectedRoute children={<Dashboard/>}/>}/>
      <Route path='/import' element={<ImportData/>}/>
    </Routes>
   </ToastContaier>
  );
}

export default App;
