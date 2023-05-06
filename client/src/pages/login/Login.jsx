import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './login.css';

function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const {dispatch,isFetching} = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type:"LOGIN_START"});
    try {
      const res = await axios.post('http://localhost:5002/api/auth/login', {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({type:"LOGIN_SUCCESS",payload:res.data});
      res.data && window.location.replace(`/`);
    } catch (error) {
      setError(error);
      alert("Enter correct credentials");
      dispatch({type:"LOGIN_FAILURE"});
    }
  }

  return (
    <div className='loginConatiner'>
      <div className='loginCard'>
        <h2 className='login-title'>Login</h2>
        <form className='loginForm' onSubmit={handleSubmit}>
          <input type='text' id='username' name='username' placeholder='Username' ref={userRef} />
          <input type='password' id='password' name='Password' placeholder='Password' ref={passwordRef} />
          <button type='submit' disabled={isFetching}>Login</button>
          <div className='register_text' style={{ color: '#fff' }}>Don't have a account  ? <Link to='/register' className='link'>Register</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Login
