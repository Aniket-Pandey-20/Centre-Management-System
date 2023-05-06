import React,{useContext, useEffect} from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Context } from '../../context/Context';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

import BarGraph from '../../component/Graphs/BarGraph/BarGraph';
import PieChart from '../../component/Graphs/PieChart/PieChart';
import { useState } from 'react';
import { axiosJWT } from '../../App';

function Dashboard() {
  const {user} =useContext(Context);//change after testing
  const {dispatch} = useContext(Context);
  const [barGraphData,setBarGraphData] = useState([]);
  const[loading,setloading]=useState(true);
  const[centresData,setcentresData] = useState({});
  const[approvedcentre,setApprovedcentre] = useState({});
  const[rejectedcentre,setRejectedcentre] = useState({});

  useEffect(()=>{
    const fetchGraphData = async()=>{
      try {
        const res=await axiosJWT.get('http://localhost:5002/api/admin/graph/states',{headers: {
          authorization: "Bearer " + user.accessToken,
        }});
        setBarGraphData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchGraphData();

    //Fetching centres
    const fetchCD = async()=>{
      setloading(true);
      try {
        const res = await axiosJWT.get("http://localhost:5002/api/form",{headers: {
        authorization: "Bearer " + user.accessToken,
        }});
        const res_A = await axiosJWT.get("http://localhost:5002/api/admin/approvedcentre",{headers: {   //Approved centres
          authorization: "Bearer " + user.accessToken,
        }});
        const res_R = await axiosJWT.get("http://localhost:5002/api/admin/rejectedcentre",{headers: {   //Rejected centres
          authorization: "Bearer " + user.accessToken,
        }});
        res && setcentresData(res.data);//All centres
        res_A && setApprovedcentre(res_A.data.length);//Approved centres
        res_R && setRejectedcentre(res_R.data.length);//Rejected centre
        res && setloading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCD();
  },[])

  const handleLogout = () =>{
    dispatch({type:"LOGOUT"});
  };

  return (<>
    {loading ? (
      <div  style={{display:'flex',justifyContent:'center'}}>
        <div class="spinner-border m-5" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>   
      </div>
    ):(
      <div className='dashboardContainer'>
        <div className="dash-head">
          <Link to='/' style={{textDecoration:'none'}}>
            <span class="dash-title-icon mr-2" style={{cursor:'pointer'}}>
              <HomeIcon/>
            </span>
          </Link>
          <h1 class="display-6 text-center text-wrap head-title" style={{borderBottom:"1px solid black",marginLeft:user.type === 'admin'? '90px' : ''}}>DASHBOARD</h1>
          <span className='headBtn'>
            {user.type === 'admin' && <Link to='/rh/register'>
              <button class=' btn btn-outline-primary btn-sm col-hid'>Register RH</button>
            </Link>}
            {user && <button class='btn btn-outline-primary btn-sm' style={{marginLeft:'15px'}} onClick={handleLogout}>Logout</button>}
          </span>
        </div>
        <div className='dashWrapper'>
          <div className="dashCards row">
            <div class="col-md-4">
              <div class="A card text-white">
                <Link class="card-body" to='/centrelist' state={'centresData'}>
                  <img src={require('../../assets/images/circle.png')}class="card-img-absolute" alt="circle"/>
                  <h4 class="font-weight-normal mb-3"><span>TOTAL REGISTERED CENTRE</span> <AppRegistrationIcon class="icon float-right" /></h4>
                  <h2 class="mb-5">{centresData.length}</h2>
                </Link>
              </div>
            </div>
            <div class="col-md-4">
              <div class="B card text-white">
                <Link class="card-body" to='/centrelist' state={'approvedcentre'}>
                  <img src={require('../../assets/images/circle.png')}class="card-img-absolute" alt="circle"/>
                  <h4 class="font-weight-normal mb-3"><span style={{letterSpacing:'0.28px'}}>{user.type === 'rh' ? "APPROVED CENTRES BY YOU" :"TOTAL APPROVED CENTRES"}</span> <FactCheckOutlinedIcon class="icon float-right" /></h4>
                  <h2 class="mb-5">{approvedcentre}</h2>
                </Link>
              </div>
            </div>
            <div class="col-md-4">
              <div class="C card text-white">
                <Link class="card-body" to='/centrelist' state={'rejectedcentre'}>
                  <img src={require('../../assets/images/circle.png')}class="card-img-absolute" alt="circle"/>
                  <h4 class="font-weight-normal mb-3"><span style={{letterSpacing:'0.76px'}}>{user.type === 'rh' ? "REJECTED CENTRE BY YOU" :"TOTAL REJECTED CENTRE"}</span> <UnpublishedOutlinedIcon class="icon float-right"/></h4>
                  <h2 class="mb-5">{rejectedcentre}</h2>
                </Link>
              </div>
            </div>
          </div>
          {/*Html for mobile devices*/}
          {user.type === 'admin' && <Link to='/rh/register'>
              <button class='btn btn-primary col-mob' style={{display:'none',paddingLeft:'35%'}}>Register RH</button>
          </Link>}
          <div className="dashGraphs">
            <div className="dashGraph1">
              <h4 className='dashGraph-title'>STATE WISE CENTRE</h4>
              <div id="carouselExampleControls" class="carousel slide carousel-fade">
                <div class="carousel-inner">
                  <div class="carousel-item active" data-interval="5000">
                    <BarGraph Data={barGraphData.slice(0,12)} />
                  </div>
                  <div class="carousel-item" data-interval="5000">
                    <BarGraph Data={barGraphData.slice(12,24)}/>
                  </div>
                  <div class="carousel-item" data-interval="5000">
                    <BarGraph Data={barGraphData.slice(24,36)}/>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="dashGraph2">
              <h4 className='dashGraph-title'>APPROVAL STATS.</h4>
              <PieChart Data={{approved:approvedcentre,rejected:rejectedcentre,inProcess:centresData.length - (approvedcentre+rejectedcentre)}}/>
            </div>
          </div>
        </div>          
      </div>
    )}
  </>
  )
}

export default Dashboard
