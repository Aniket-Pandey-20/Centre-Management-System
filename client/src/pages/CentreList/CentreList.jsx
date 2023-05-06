import React, { useContext, useState ,useEffect} from 'react'
import { Context } from '../../context/Context'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import HomeIcon from '@mui/icons-material/Home';
import * as XLSX from 'xlsx';
import './centreList.css';
import SearchIcon from '@mui/icons-material/Search';
import {cityFunction} from '../../data/dataHandleFun.js';
import {statesFunction} from '../../data/dataHandleFun.js';
import { axiosJWT } from '../../App';

function CentreList() {
  const {user,dispatch} = useContext(Context);

  const location = useLocation();
  const type = location.state;                           //Getting the data, passed thorugh the link's state section
  const query = location.search;
  const req = new URLSearchParams(query);

  const [data,setData] = useState([]);                   //To store the result after the api call for centres
  const [searchInput,setSearchInput] = useState('');     //To store the input of the search bar
  const[states,setStates] = useState([]);                //store all the states
  const [curState,setCurState] = useState('-1');          
  const[cities,setCities] =useState([]);                 //Store all cities 
  const[filteredData,setFilteredData] = useState(data);  //Store centres after the filter
  const[loading,setloading]=useState(true);

  //Sorting cities based on state
  var filteredCity =req.get('state_id') ?  cities.filter((c)=>c.state_id == req.get('state_id')):
                                            (curState == -1 ? cities : 
                                            cities.filter((c)=>c.state_id == curState));
//Fetching initial Details
  useEffect(()=>{
    cityFunction().then(result => setCities(result.data));
    statesFunction().then(result =>setStates(result.data));

    const fetchCD = async()=>{
      setloading(true);
      var res;
      try {
        if(type == 'centresData'){
          res = await axiosJWT.get("http://localhost:5002/api/form",{headers: {                   //All center
          authorization: "Bearer " + user.accessToken,
        }});
        }else if(type == 'approvedcentre'){
          res = await axiosJWT.get("http://localhost:5002/api/admin/approvedcentre",{headers: {   //Approved centers
            authorization: "Bearer " + user.accessToken,
          }});
        }else if(type == 'rejectedcentre'){
          res = await axiosJWT.get("http://localhost:5002/api/admin/rejectedcentre",{headers: {   //Rejected centers
            authorization: "Bearer " + user.accessToken,
          }});
        }else if(req.get('state_id')){  
          res = await axiosJWT.get("http://localhost:5002/api/form",{headers: {                   //State wise center
            authorization: "Bearer " + user.accessToken,
          }});
          res = {data :(res.data).filter(r=>(r.state == req.get('state_id')))};//Sending data in a particular format after filter
        }
        if(res.data.length === 0){
          res && setData([]);
          setFilteredData([])
        }else{
          res && setData(res.data);
          setFilteredData(res.data);
        }
        res && setloading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCD();
    //Disable state filter if came through barGraph
  },[])

  useEffect(()=>{
    const filterTags = document.querySelectorAll('select');
    if(searchInput.length > 0){
      Array.prototype.map.call(filterTags,(fa)=>{
        fa.value =  '-1';
        fa.disabled = true
      })
    }else{
      Array.prototype.map.call(filterTags,(fa)=>{
        fa.disabled = false
      })
      
    }
    setFilteredData(data.filter(d=>(d.centre_name.toLowerCase()).includes(searchInput.toLowerCase())))
  },[searchInput])

  const handleFilter = ()=>{
    const filterTags = document.querySelectorAll('select');
    var afterFilter = data;
    Array.prototype.map.call(filterTags,(fa)=>{
      const value = fa.value == 'In Process' ? null:fa.value;
      if(value != -1){
        afterFilter = afterFilter.filter((d)=>(value != -1 && d[fa.name] == value));
      }
    })
    setFilteredData(afterFilter);
  }

  const handleLogout = () =>{
    dispatch({type:"LOGOUT"});
  };

  const handleReject =async(centre_id,e)=>{
    e.preventDefault();
    try {
      await axiosJWT.put(`http://localhost:5002/api/reject`,{
          centre_id
          },{headers: {
              authorization: "Bearer " + user.accessToken,
          }});
      alert("Centre Rejected");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const handleApprove = async(centre_id,e)=>{
    e.preventDefault();
    try {
      await axiosJWT.put(`http://localhost:5002/api/approve`,{
          centre_id:centre_id
          },{headers: {
              authorization: "Bearer " + user.accessToken,
          }}
        );
      alert("Centre Approved");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

  }

  const handleStatusChange = async(centre_id,e)=>{
    e.preventDefault();
    try {
      if(user.type === 'admin'){
        await axiosJWT.put('http://localhost:5002/api/changeStatus',{
          centre_id
        },{headers:{
              authorization: "Bearer " + user.accessToken,
        }})
        alert("Status Changed")
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload =(data,e)=>{
    e.preventDefault();
    //Filtering the data(removing unnecessary key and values)
    const keysToRemove = ['user_id','centre_id','status_change_by','is_approved'];
    data.forEach(obj => {
      keysToRemove.forEach(key => {
        delete obj[key];
      });
      //Replacing state and city id from its name
      obj["state"] = states.filter(s => s.value == obj["state"])[0].label;
      obj["city"] = cities.filter(c => c.value == obj["city"])[0].label;
    });

    //Column name should be in same sequence  as of the sequence of data in table
    const columnNames=["Centre Name","Local Town","Pincode","Building Number & Name","Street Number & Name","Landmark","Nearest Railway station Name","Railway station Distance","Nearest Bus station Name","Bus station Distance","No. of Entry Point","No. of Exit Point","Parking Facility","Clockroom Facility","State","City","Centre Superintendent Name","Superintendent Email","Total System","Total No. of Lab","No. of Network","No. of Fire Extinguisher","Partition in Each Lab","AC in Each Lab","CCTV in Each Lab","Internet Speed","UPS[KVA]","UPS Backup(in Minutes)","Genset[KVA]","Categories of Test Centre","UPS Backup(2nd)","Genset[KVA](2nd)","Superintendent Contact No."];
    const worksheet = XLSX.utils.json_to_sheet(data,{ header:[] });

    //I have copy pasted this from chatgpt
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
      worksheet[cellAddress].v = columnNames[col]; // Set custom column name
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  }

  return (<>
    {!loading &&
      <div className='centerList-container'>
        <div className="dash-head">
          <Link to='/' style={{textDecoration:'none'}}>
            <span class="dash-title-icon mr-2" style={{cursor:'pointer'}}>
              <HomeIcon/>
            </span>
          </Link>
          <h1 class="display-6 text-center text-wrap" style={{borderBottom:"1px solid black",letterSpacing:'2px',marginLeft:'20px'}}>CENTRES LIST</h1>
          <span>{user && <button class=' btn btn-outline-primary btn-sm' onClick={handleLogout}>Logout</button>}</span>
        </div>
       <div className="centerlist-section">
          <div className="filterSection">
            <span className='filters'>
              <select class="f-sub form-select" name="state" aria-label="Default select example"onChange={(e) => setCurState(e.target.value)}>
                <option value = "-1">{req.get('state_id') ?  req.get('state'): 'All(States)'}</option>
                {!req.get('state_id') && states.map((s, index)=> {
                  if(s.value===8) {
                    return (<option key= {index} value= {s.value}>Dadar & Daman and Diu</option>)
                  }
                  else {
                    return (<option key= {index} value= {s.value}>{s.label}</option>)
                  }
                })}
              </select>
              <select class="f-sub form-select" name="city" aria-label="Default select example">
                <option value ="-1">All(City)</option>
                {filteredCity.map((c,index) => (<option key={index} value={c.value}>{c.label}</option>))}
              </select>
              <select class="f-sub form-select" name="is_approved" aria-label="Default select example">
                <option value="-1">All(Approval Status)</option>
                <option value="1">Approved</option>
                <option value="0">Rejected</option>
                <option value={null}>In Process</option>
              </select>
              <span className='searchSection'>
                <div class="form">
                  <span>Search by center Name</span>
                  <input type="text" class="form-control form-input" placeholder="Search..." onChange={(e) => setSearchInput(e.target.value)}/>
                  <button type='submit' className='search-icon'><SearchIcon/></button>
                </div>
              </span>
            </span>
            <button type="button" id='filter-btn' class="btn btn-primary btn-sm" onClick={handleFilter}>Filter</button>
          </div>
           {filteredData.length !== 0 ? <div className="centerTable">
            <div class="responsive-table">
              <li class="table-header">
                <div class="col col-1 col-hid-mob">S.No</div>
                <div class="col col-2">Centre Name</div>
                <div class="col col-3">Status</div>
                <div class="col col-3">Change Status</div>
              </li>

              {data && filteredData.map((d,index)=>(
                <Link className='static-page-Link' to={`/viewDetail/form?centre_id=${d.centre_id}`} key = {index}>
                  <span class="tooltiptext">View Centre Details</span>
                  <li class="table-row" key = {index}>
                    <div class="col col-1 col-hid-mob" data-label="number">{index+1}</div>
                    <div class="col col-2" data-label="Centre Name">{d.centre_name}</div>
                    <div class="col col-3" data-label="Status"
                      style={d.is_approved === true ? {color:'Green'}:(d.is_approved === false ? {color:'red'}:{color:'#95A1B9'})} style={{display:'flex',flexDirection:'column'}}>
                      {d.is_approved === true ? `Approved`:(d.is_approved === false ? `Rejected`:"In Process")}<br/>
                      {d.is_approved ===null ? "":<span style={{fontSize:'12px',color:'#51555f'}}>by {d.status_change_by}</span>}
                    </div>
                    <div className=" col col-3 changeStatus-div">
                      <div class="col-hid-mob" data-label="Approve">
                        {d.is_approved === null ? <button type="button" class="btn btn-outline-success btn-sm" onClick={(e) => handleApprove(d.centre_id,e)}>Approve</button> :
                          (d.is_approved === false && user.type === 'admin' && <button type="button" class="btn btn-outline-success btn-sm" onClick={(e) => handleApprove(d.centre_id,e)}>Approve</button>)}
                      </div>
                      <div class="col-hid-mob" data-label="Reject">
                        {d.is_approved === null ? <button type="button" class="btn btn-outline-danger btn-sm" onClick={(e) => handleReject(d.centre_id,e)}>Reject</button> :
                          (d.is_approved === true && user.type === 'admin' && <button type="button" class="btn btn-outline-danger btn-sm" onClick={(e) => handleReject(d.centre_id,e)}>Reject</button>)}
                      </div>
                      {user.type === 'admin' && <div class="col-hid-mob" data-label="In Process">
                        {d.is_approved !== null && 
                          <button type="button" class="btn btn-outline-primary btn-sm" onClick={(e) => handleStatusChange(d.centre_id,e)}>
                            In Process
                          </button>}
                      </div>}
                    </div>
                    {/*Html for mobile devices*/}
                    <div className='btn-mob' style={{display:'none'}}>
                      <div class="col col-3" data-label="Approve">
                        {d.is_approved === null ? <button type="button" class="btn btn-outline-success btn-sm"  onClick={(e) => handleApprove(d.centre_id,e)}>Approve</button> :
                          (d.is_approved === false && user.type === 'admin' && (<button type="button" class="btn btn-outline-success btn-sm" onClick={(e) => handleApprove(d.centre_id,e)}>Approve</button>))}
                      </div>
                      <div class="col col-3" data-label="Reject">
                        {d.is_approved === null ? <button type="button" class="btn btn-outline-danger btn-sm" style={{paddingLeft:'15px',paddingRight:'15px',marginTop:'5px'}} onClick={(e) => handleReject(d.centre_id,e)}>Reject</button> :
                          (d.is_approved === true && user.type === 'admin' && <button type="button" class="btn btn-outline-danger btn-sm" onClick={(e) => handleReject(d.centre_id,e)}>Reject</button>)}
                      </div>
                      {user.type === 'admin' && <div class="col col-3" data-label="In Process">
                      {d.is_approved !== null &&
                        <button type="button" class="btn btn-outline-primary btn-sm" style={{fontSize:'12.5px',marginTop:'5px'}} onClick={(e) => handleStatusChange(d.centre_id,e)}>
                          InProcess
                        </button>}
                      </div>}
                    </div>

                  </li>
                </Link>
              ))}
            </div>
          </div>: <h1 class="display-6 text-center text-wrap" style={{margin:'20px'}}>No Centres</h1>}
          {filteredData.length !== 0 && <div className='downloadbtn'>
            <button className='btn btn-outline-secondary' onClick={(e) => handleDownload(filteredData,e)}>Download Centre List</button>
          </div>}             
        </div> 
      </div>
    }
    </>
  )
}

export default CentreList
