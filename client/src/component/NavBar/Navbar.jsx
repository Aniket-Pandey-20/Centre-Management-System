import React, {useContext}from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css';
import { Context } from '../../context/Context';

const Navbar = () => {
  const {user} =useContext(Context);//change after testing
  const {dispatch} = useContext(Context);
  const handleLogout = () =>{
    dispatch({type:"LOGOUT"});
  };

  return(<>
  {(user && user.type == 'user') && (<nav class="navbar navbar-expand-lg navbar-light bg-light"  style={{height:"55px"}}>
  <div class="container-fluid">
    <div class="navbar" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <Link class="nav-link active" aria-current="page" to={`/`}>Home</Link>
        <Link class="nav-link" to={`/form`}>Register Centre</Link>
      </div>
    </div>
    {user && <button id='logoutBtn' class='btn btn-outline-primary btn-sm' onClick={handleLogout}>Logout</button>}
  </div>
  </nav>)}
  </>)
}

export default Navbar
