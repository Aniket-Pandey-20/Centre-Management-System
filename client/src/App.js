import react, { useContext, useEffect, useState } from "react";
import {Routes,Route,BrowserRouter as Router} from 'react-router-dom'
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import FormC from './pages/form/FormC';
import Navbar from "./component/NavBar/Navbar";
import Home from "./pages/Home/Home";
import Dashboard from './pages/Dashboard/Dashboard';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Context } from "./context/Context";
import CentreList from "./pages/CentreList/CentreList";

export const axiosJWT = axios.create()

function App() {
  const {user,dispatch} = useContext(Context);
  const[sessionExpStatus,setSessionExpStatus] = useState(false);


  //checking the expiration time of refresh token
  axiosJWT.interceptors.request.use(async (res)=>{
    if(user !== null){
      let currentDate = new Date();
      const decodedAccToken = jwt_decode(user.accessToken);
      const decodedRefToken = jwt_decode(user.refreshToken);

      //If refresh Token is expired
      if(decodedRefToken.exp * 1000 < currentDate.getTime()){
        setSessionExpStatus(true);
      }
      else if (decodedAccToken.exp * 1000 < currentDate.getTime()) {
        try {
          const result = await axios.post("http://localhost:5002/api/refresh", {token: user.refreshToken});
          if(result){
            dispatch({type:"REFRESH_ACCESS_TOKEN",payload:{...user,accessToken:result.data.accessToken,refreshToken:result.data.refreshToken}});
            res.headers["authorization"] = "Bearer " + result.accessToken;
            window.location.reload();
            return res;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    return res;
  },(error)=>{
    console.log("not ok")
    return Promise.reject(error)
  })

  const handleLogout = () =>{
    setSessionExpStatus(false);
    dispatch({type:"LOGOUT"});
  };

  return ( 
    <Router>
      <Navbar/>
      {sessionExpStatus && <div style={{display:'flex',justifyContent:'center',marginTop:'200px'}}>
        <div style={{width:'400px',height:'135px',padding:'10px',background:'#F2F6FD',borderRadius:'10px',boxShadow: '12px 23px 35px 0px rgba(204,204,204,1)'}}>
          <p style={{fontSize:'20px',letterSpacing:'1.5px',padding:'15px'}}>Session Expired</p>
          <button className="btn btn-outline-primary btn-sm" style={{marginLeft:'300px',width:'70px'}} onClick={handleLogout}>OK</button>
        </div>
      </div>}
      <Routes>
        <Route path='/' exact element={user ? (user.type == 'admin' || user.type == 'rh') ? <Dashboard/> : <Home/> : <Login/>}/>

        <Route path="/register" element={user ? <Home /> : <Register />} />

        <Route path="/rh/register" element={user && (user.type ==='admin' && <Register/>)} />

        <Route path="/register" element={user ? <Home /> : <Register />} />
          
        <Route path="/login" element={user ? <Home /> : <Login />} />

        <Route path='/update/form' exact element={user ? <FormC/> : <Login/>}/>

        <Route path='/viewDetail/form' exact element={user ? <FormC/> : <Login/>}/>

        <Route path='/form' exact element={user ? <FormC/> : <Login/>}/>

        <Route path='/centreList' exact element={(user && (user.type == 'admin' || user.type == 'rh')) ? <CentreList/> : <Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
