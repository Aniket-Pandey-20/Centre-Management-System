//Static Form section which helps in reviewing the details
import React, {useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Form.css';
import Select from 'react-select';
import { Context } from '../../context/Context';
import { Link } from 'react-router-dom';

function StaticForm({details,Cities,states}) {
    const{user,dispatch} = useContext(Context)
    const[errors,setErrors] = useState(0);//for normal error
    const[fc,setFC] = useState([]);//Cities after filter storage
    const[curCity,setCurCity] = useState();//Current city
    const[curState,setCurState] = useState();//Current State
    const[secState,setSecState] = useState([true,false,false]);
    const[secValid,setSecValid] = useState([false,false,false]);
    const[curPF,setCurPF] = useState('')// for parking facility
    const[curCF,setCurCF] = useState('')//for clockroom facility

    useEffect(()=>{
    const getCurS_C = ()=>{
      setCurState(states.filter(s=>s.value === details.state)[0]);
      setCurCity(Cities.filter(c=>c.value === details.city)[0]);
      setCurCF(details.clockroom_facility);
      setCurPF(details.parking_facility);
    }
    details && getCurS_C();
  },[details])

  const handleNext = (e)=>{
    if(secState[0] === true){
      //final for next 
        setSecState([false,true,false]);
    }else if(secState[1] === true){
        setSecState([false,false,true]);
    }
  }
  return (
    <form className="formContainer">
      <div className="mainHeading">CENTRE DETAILS</div>
      {errors === 1 && <h2 style={{color:'red'}}>Something Went Wrong!!</h2>}
      {errors === 4 && <h2 style={{color:'red'}}>Invalid email address</h2>}
      <div className='sectionContainer'>
        {/*Section heading section*/}
        <div className='sectionHeadings'>
          <div className={secState[0] ? 'sectionHeading active':'sectionHeading'} onClick={()=>setSecState([true,false,false])} style ={secValid[0] == true ? {borderTop:'5px solid #00BA49'}:{borderTop:'none'}}>
            <span >CENTRE NAME AND ADDRESS</span>
          </div>
          <div className={secState[1] ? 'sectionHeading active':'sectionHeading'} onClick={()=>setSecState([false,true,false])} style ={secValid[1] == true ? {borderTop:'5px solid #00BA49'}:{borderTop:'none'}}>
            <span>CENTRE CONTACT PERSON</span>
          </div>
            <div className={secState[2] ? 'sectionHeading active':'sectionHeading'} onClick={()=>setSecState([false,false,true])}>
            <span>HARDWARE DETAILS</span>
          </div>
        </div>
        <div className='sectionInput'>
          {/*First From Section: centre Name And Address Info*/}
          <div className={secState[0] ? 'section  active':'section'} id='section 0'>
              <div style={{width:'98%',margin: '10px'}}>
                <label >Centre Name</label><br/>
                <input type="text" placeholder='Enter Centre Name' name="centre_name" readOnly value={details && details.centre_name} /><br/>
              </div>
              <div className='division'>
                <span>
                  <label >State</label><br/>
                  <Select className="selectBar" name="state" readOnly value={curState} /><br/>
                </span>
                <span>
                  <label >City</label><br/>
                  <Select name="city" className="selectBar" readOnly value={curCity}  /><br/>
                </span> 
                <span>
                  <label >Local Town</label><br/>
                  <input type="text" name="local_town" readOnly value={details && details.local_town} /><br/>
                </span>
                <span>
                  <label >Pincode</label><br/>
                  <input type="Number" name="pincode" readOnly value={details && details.pincode}/><br/>
                </span>
              </div>   
              <div className='division'>  
                <span>
                  <label >Building Number & Name</label><br/>
                  <input type="text" name="buildingn_n" readOnly value={details && details.buildingn_n} /><br/>
                </span>
                <span>
                  <label >Street Number & Name</label><br/>
                  <input type="text" name="streetn_n" readOnly value={details && details.streetn_n}/><br/>
                </span>
                <span>
                  <label >Landmark</label><br/>
                  <input type="text" name="landmark" readOnly value={details && details.landmark} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label >Nearest Railway station Name</label><br/>
                  <input type="text" name="rail_stat_name" readOnly value={details && details.rail_stat_name} /><br/>    
                </span>
                <span>
                  <label >Distance</label><br/>
                  <input type="Number" name='rail_distance' readOnly value={details && details.rail_distance} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label >Nearest Bus station Name</label><br/>
                  <input type="text" name="bus_stat_name" readOnly value={details && details.bus_stat_name} /><br/>
                </span>
                <span>
                  <label >Distance</label><br/>
                  <input type="Number" name='bus_distance' readOnly value={details && details.bus_distance} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label>How Many Entry Point</label><br/>
                <input type="Number" name='entry_point' readOnly value={details && details.entry_point} /><br/>
                </span>
                <span>
                  <label>How Many Exit Point</label><br/>
                  <input type="Number" name='exit_point' readOnly value={details && details.exit_point} /><br/>
                </span>
                <span>
                  <label >Parking Facility</label><br/>
                    <select class="form-select" name='parking_facility' aria-label="Default select example" readOnly value={curPF}>
                      <option style={{display: 'none'}} readOnly value = '-1'>Select..</option>
                      <option readOnly value="yes">Yes</option>
                      <option readOnly value="no">No</option>
                    </select><br/>
                </span>
                <span>
                  <label >Clockroom Facility</label><br/>
                  <select class="form-select" name='clockroom_facility' aria-label="Default select example" readOnly value={curCF}>
                    <option style={{display: 'none'}} readOnly value = '-1'>Select..</option>
                      <option readOnly value="yes">Yes</option>
                      <option readOnly value="no">No</option>
                    </select><br/>
                </span>
              </div>
              <div className='prevNextBtn'>
                <button type='button' onClick={handleNext}>Next</button>
              </div>
          </div>

          {/*Second Section : centre Contact Person Info*/}
          <div className={secState[1] ? 'section  active':'section'} id='section 1'>
            <div className="division 3">
              <span>
                <label >Centre Superintendent Name</label><br/>
                <input type="text" name="sup_name" readOnly value={details && details.sup_name} /><br/>
              </span>
              <span>
                <label >Contact No(Primary)</label><br/>
                <input type="text" name="contact_no" min={'10'} max={'10'} readOnly value={details && details.contact_no} /><br/>
              </span>
              <span>
                <label >Email</label><br/>
                <input type='email' name="email" readOnly value={details && details.email} placeholder='example@mail.com'/><br/>
              </span>
            </div>
            <div className='prevNextBtn'>
              <button type='button' onClick={()=>setSecState([true,false,false])}>Go back</button>
              <button type='button' onClick={handleNext}>Next</button>
            </div>
          </div>

          {/*Hardware Details*/}
          <div className={secState[2] ? 'section 2 active':'section 2'} >
            
            <div className="division 4">
              <span>
                <label >Total System</label><br/>
                <input type="Number" name='total_system' readOnly value={details && details.total_system} /><br/>
              </span>
              <span>
                <label >Total No. of Lab</label><br/>
                <input type="Number" name="lab_cnt" readOnly value={details && details.lab_cnt} /><br/>
              </span>
              <span>
                <label >How Many Network</label><br/>
                <input type="Number" name="network_cnt" readOnly value={details && details.network_cnt} /><br/>
              </span>
              <span>
                <label >Fire Extinguisher</label><br/>
                <input type="Number" className='choiceInput' name="fire_ext" placeholder='Number of Fire Extinguisher'  readOnly value={details && details.fire_ext} /><br/>
              </span>
            </div>
            <div className="division 4">
              <span>
                <label>Partition in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name="lab_partition" placeholder='Ex- 4,10,15'  readOnly value={details && details.lab_partition} /><br/>
              </span>
              <span>
                <label >AC in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name='ac_cnt' placeholder='Ex - 2,4,10..'  readOnly value={details && details.ac_cnt} /><br/>
              </span>
              <span>
                <label >CCTV in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name="no_of_cctv" placeholder='Ex - 2,5,11..'  readOnly value={details && details.no_of_cctv} /><br/>
              </span>
              <span>
                <label >Internet Speed</label><br/>
                <input type="Number" name="net_speed"  readOnly value={details && details.net_speed} /><br/>
              </span>
            </div>

            <div className="division 3">
              <span>
                <label>UPS[KVA]</label><br/>
                <input type="text" name='ups'  readOnly value={details && details.ups} /><br/>
              </span>
              <span>
                <label>UPS Backup(in Minutes)</label><br/>
                <input type="number" name='backup_ups1'  readOnly value={details && details.backup_ups1} /><br/>
              </span>
              <span>
                <label >Genset[KVA]</label><br/>
                <input type="text" name="genset"  readOnly value={details && details.genset} /><br/>
              </span>
            </div>

            <div className="division 3">
              <span>
                <label>Categories of Test Centre</label><br/>
                {/* <Select options={states} className="selectBar" name="state" readOnly value={curState} onChange={getCities}/><br/> */}
                <input type="text" className='choiceInput' name='test_categories' placeholder='Private or Government'  readOnly value={details && details.test_categories} /><br/>
              </span>
              <span>
                <label>UPS Backup(in Minutes)</label><br/>
                <input type="number" name='backup_ups2'  readOnly value={details && details.backup_ups2} /><br/>
              </span>
              <span>
                <label >Genset[KVA]</label><br/>
                <input type="text" name='getset2' readOnly value={details && details.getset2} /><br/>
              </span>
            </div>
            <div className='prevNextBtn'>
              <button type='button' onClick={()=>setSecState([false,true,false])}>Go back</button>
              <button type='button' onClick={() => window.history.go(-1)}>Centres List Page</button>
            </div>
          </div>
        </div>  
      </div>
    </form>
  )
}

export default StaticForm
