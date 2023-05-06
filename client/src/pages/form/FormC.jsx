import React,{useContext, useEffect, useState} from 'react'
import Form from './Form';
import StaticForm from './StaticForm';
import axios from 'axios';
import {statesFunction} from '../../data/dataHandleFun.js';
import {cityFunction} from '../../data/dataHandleFun.js';
import { Context } from '../../context/Context';
import { axiosJWT } from '../../App';


function FormC() {
  const url = new URLSearchParams(window.location.search);
  const{user,dispatch} = useContext(Context)
  const[details,setDetails] = useState({})//variable to store data of form
  const[states,setStates] = useState([]);
  const[Cities,setCities] =useState([]);
  const urlLastSec = (window.location.href).split('/')[3];
//get request functions

useEffect(()=>{
  cityFunction().then(result => setCities(result.data));
  statesFunction().then(result =>setStates(result.data));
  const fetchDetails = async ()=>{
    try{
      const res = await axiosJWT.get("http://localhost:5002/api/form?centre_id="+url.get('centre_id'),{headers: {
        authorization: "Bearer " + user.accessToken,
      }});
      setDetails(res.data);
    }catch(error){
      console.log(error)
    }  
  }
  urlLastSec === 'update' || urlLastSec === 'viewDetail' ? fetchDetails():setDetails(null);
},[])


  return (<>
    {urlLastSec === 'viewDetail' ? <StaticForm details ={details} states={states} Cities={Cities}/> : <Form details = {details} states={states} Cities={Cities}/>}
  </>)
}

export default FormC
