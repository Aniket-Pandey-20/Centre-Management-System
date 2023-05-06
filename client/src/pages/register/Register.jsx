import React, {useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './register.css';
import { Context } from '../../context/Context';
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
  const {user} = useContext(Context)
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPass,setConfirmPass] = useState('');
  const [captchaStatus,setCaptchaStatus] = useState(false);
  const [capToken,setCapToken] = useState('')
  const url = window.location.href;
  const recaptchaRef = useRef();

  {/*Reload Captcha ervry time page renders*/}
  useEffect(()=>{
    setTimeout(() =>{
    window.grecaptcha.render('recaptcha', {
       sitekey: "6LfV6a8lAAAAAOfki4x-Z-PIkw3iEZfYqM3nWPia",
    });
  },300);
  })

  const handleSubmit =async (e)=>{
    e.preventDefault();
    if(password === confirmPass){
      try {
        if(url.split('/')[3] === "rh" && user.type === 'admin'){
          const res =await axios.post('http://localhost:5002/api/auth/rh/register',{
            username:username,
            password:password,
          });
          res.data && alert (`RH created with username "${username}"`);
          window.location.replace('/');
        }else{
          const res =await axios.post('http://localhost:5002/api/auth/register',{
            username:username,
            password:password,
          });
          res.data&& window.alert("User Registered")
          res.data && window.location.replace('/login');
        }
      } catch (error) {
        alert("User Already Registered Go to Login Page");
        window.location.replace('/login');
      }
    }else{
      alert("Confirm Passwrod and Password is not matching.");
      window.location.reload();
    }
  };

  const handleReCatcha =async()=>{
    const res = await axios.post("http://localhost:5002/api/auth/verifyCaptchaToken",{token:recaptchaRef.current.getValue()});
    if(res.data.status === true){
      setCaptchaStatus(true);
    }else{
      alert("Bot Alert!, If you are not a bot re=enter the credentials")
      recaptchaRef.current.reset();
      window.location.reload();
    }
  }
  
  return (
    <div className='registerConatiner'>
      <div className='registerCard'>
        <h2 className='register-title'>{user && user.type === 'admin' ? "Register RH" : "Register"}</h2>
        <form className='registerForm' onSubmit={handleSubmit}>
          <input type='text' id='username' name='Username'placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
          <input type='password' id='password' name='Password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
          <input type='password' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' onChange={(e) => setConfirmPass(e.target.value)}/>

          <ReCAPTCHA
            ref={recaptchaRef}
            id='recaptcha'
            className='g-recaptcha'
            sitekey="6LfV6a8lAAAAAOfki4x-Z-PIkw3iEZfYqM3nWPia"
            style={{transform:'scale(0.85)',marginTop:'10px'}}
            onChange={handleReCatcha}
          />
          
          <button type='submit' className='submitBtn' disabled={!captchaStatus}>Register</button>
          {url.split('/')[3] !== "rh" &&<div className='login_text' style={{color:'white'}}>Already have a account ?<Link className='link' to='/login'>Login</Link></div>}
        </form>
      </div>
    </div>
  )
}

export default Register
