import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from '../Services/Contexts/AuthContext';
import Dashboard from '../Pages/Dashboard';
import Products from '../Pages/Products';
import Product from '../Pages/Products/product';
import Register from '../Pages/Register';
import Admin from '../Pages/Admin';
import VerifyCentralGov from '../Pages/Admin/VerifyCentralGov';
import VerifyStateGov from '../Pages/Admin/VerifyStateGov';
import CentralGovs from '../Pages/CentralGovs';
import CentralGov from '../Pages/CentralGovs/centralGov';
import StateGovs from '../Pages/StateGovs';
import StateGov from '../Pages/StateGovs/stateGov';
import Profile from '../Pages/Profile';

const Routing = () => {
  const {authState}  = useContext(AuthContext);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;
  const isRegistered = authState.stakeholder.isRegistered;
  const authRoutes = () => {
    if(isAuthenticated && !isRegistered) {
      return(
        <>
        <Route path="/products" element={<Products/>} />
        <Route path="/products/:id" element={<Product/>} />
        <Route path="/register" element={<Register/>} />
        </>
      )
    }
    else if(isAuthenticated){
      return(
        <>
        <Route path="/products" element={<Products/>} />
        <Route path="/products/:id" element={<Product/>} />
        </>
      )
    }
  }

  const roleRoutes = () => {
    if(role === 'admin'){
      return(
        <>
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/verify/centralGov" element={<VerifyCentralGov/>} />
        <Route path="/admin/verify/stateGov" element={<VerifyStateGov/>} />
        </>
      )
    }
    else if(role === 'centralGov'){
      return(
        <>
        <Route path="/centralGovs" element={<CentralGovs/>} />
        <Route path="/centralGovs/:id" element={<CentralGov/>} />
        </>
      )
    }
    else if(role === 'stateGov'){
      return(
        <>
        <Route path="/stateGovs" element={<StateGovs/>} />
        <Route path="/stateGovs/:id" element={<StateGov/>} />
        </>
      )
    }
    else if(isRegistered){
      return(
        <>
        <Route path="/profile" element={<Profile/>} />
        </>
      )
    }
  }
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      {authRoutes()}
      {roleRoutes()}
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  )
}
export default Routing;