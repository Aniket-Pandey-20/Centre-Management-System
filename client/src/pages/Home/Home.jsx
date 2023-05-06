import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import { axiosJWT } from '../../App';
function Home() {
  const {user,dispatch} = useContext(Context)
  const [data,setData] = useState();

  useEffect(()=>{
    const getCtDetails = async()=>{
      await axiosJWT.get(`http://localhost:5002/api/get?username=${user.username}`,{headers: {
        authorization: "Bearer " + user.accessToken,
      }}).then((res) => setData(res.data))
        .catch((err) => console.log(err));
    }
    getCtDetails();
  },[])

  const handleDelete=async (centre,e)=>{
    if(window.confirm(`Are you sure you want to delete details of "${centre.centre_name}" centre`)){
      try {
        await axiosJWT.delete(`http://localhost:5002/api/delete?centre_id=${centre.centre_id}&state=${centre.state}`,{headers: {
          authorization: "Bearer " + user.accessToken,
        }});
        window.location.reload();
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div class='homeContainer'>
      {data === 0 ?<>
        {/*<img src='/'/>  Helps to add no result image as your wish*/}
        <h1 class="display-6 text-center text-wrap" style={{marginTop:'100px'}}>No Registered Centre Yet</h1>
        </>
        :(
        <>
          <h1 class="display-6 text-center text-wrap mt-5" style={{borderBottom:"1px solid black"}}>Registered Centre</h1>
          {/*table Section*/} 
          <div className="centerTable">
            <div class="responsive-table">
              <li class="table-header">
                <div class="col col-1 col-hid-mob">S.No</div>
                <div class="col col-2">Centre Name</div>
                <div class="col col-3">Status</div>
                <div class="col col-3 col-mob">Operations</div>
              </li>
              {data && data.map((d,index)=>(<>
                {d.is_approved !== null ? <Link className='static-page-Link' to={`/viewDetail/form?centre_id=${d.centre_id}`} key = {index}>
                  <span class="tooltiptext">View Centre Details</span>
                  <li class="table-row" key = {index}>
                    <div class="col col-1 col-hid-mob" data-label="number">{index+1}</div>
                    <div class="col col-2" data-label="centre Name">{d.centre_name}</div>

                    <div class="col col-3" data-label="Status"
                      style={d.is_approved === true ? {color:'Green'}:(d.is_approved === false ? {color:'red'}:{color:'#95A1B9'})}
                    >{d.is_approved === true ? "Approved":(d.is_approved === false ? "Rejected":"In Process")}</div>
                    
                    {d.is_approved === null ?
                      <div className="col col-3 col-hid-mob">
                        <div class="col" data-label="Update">
                          <Link className='link' to={`/update/form?centre_id=${d.centre_id}`}>
                            <button type="button" class="btn btn-outline-secondary btn-sm">
                              Update
                            </button>
                          </Link>
                        </div>
                        <div class="col" data-label="Delete">
                          <button type="button" class="btn btn-outline-danger btn-sm" onClick={(e) => handleDelete(d,e)}>Delete</button>
                        </div>
                      </div>
                      :
                      <div className='col col-3' style={{color:'#95A1B9'}}>Denied op.</div>
                    }

                  {/*Html for mobile devices*/}
                    <div class="col col-3 col-mob" data-label="Update" style={{display:'none'}}>
                      <Link className='link '  to={`/update/form?centre_id=${d.centre_id}`}>
                        <button type="button" class="btn btn-outline-secondary btn-sm">
                          Update
                        </button>
                      </Link>
                      <button type="button" style={{width:' 63px',marginTop:'5px'}} class="btn btn-outline-danger btn-sm"onClick={(e) => handleDelete(d,e)}>Delete</button>
                    </div>
                  </li>
                </Link>:
                <li class="table-row" key = {index}>
                    <div class="col col-1 col-hid-mob" data-label="number">{index+1}</div>
                    <div class="col col-2" data-label="centre Name">{d.centre_name}</div>

                    <div class="col col-3" data-label="Status"
                      style={d.is_approved === true ? {color:'Green'}:(d.is_approved === false ? {color:'red'}:{color:'#95A1B9'})}
                    >{d.is_approved === true ? "Approved":(d.is_approved === false ? "Rejected":"In Process")}</div>
                    
                    {d.is_approved === null ?
                      <div className="col col-3 col-hid-mob">
                        <div class="col" data-label="Update">
                          <Link className='link' to={`/update/form?centre_id=${d.centre_id}`}>
                            <button type="button" class="btn btn-outline-secondary btn-sm">
                              Update
                            </button>
                          </Link>
                        </div>
                        <div class="col" data-label="Delete">
                          <button type="button" class="btn btn-outline-danger btn-sm" onClick={(e) => handleDelete(d,e)}>Delete</button>
                        </div>
                      </div>
                      :
                      <div className='col col-3' style={{color:'#95A1B9'}}>Denied op.</div>
                    }

                  {/*Html for mobile devices*/}
                    <div class="col col-3 col-mob" data-label="Update" style={{display:'none'}}>
                      <Link className='link '  to={`/update/form?centre_id=${d.centre_id}`}>
                        <button type="button" class="btn btn-outline-secondary btn-sm">
                          Update
                        </button>
                      </Link>
                      <button type="button" style={{width:' 63px',marginTop:'5px'}} class="btn btn-outline-danger btn-sm"onClick={(e) => handleDelete(d,e)}>Delete</button>
                    </div>
                </li>
                }
                </>
              ))}
            </div>
          </div>
        </>
      )}
      
    </div>
  )
}

export default Home;
