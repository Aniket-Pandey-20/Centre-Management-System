import React, {useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Form.css';
import Select from 'react-select';
import { Context } from '../../context/Context';
import { axiosJWT } from '../../App';

const Form = ({details,Cities,states}) => {
  const{user,dispatch} = useContext(Context)
  const query = window.location.search;
  const req = new URLSearchParams(query);
  const[column,setColumn] = useState([]);
  const[values,setValues] = useState([]);
  const[errors,setErrors] = useState(0);//for normal error
  const[isSubmit,setIsSubmit] = useState(false);
  const[fc,setFC] = useState([]);//Storage for Cities after filter                                                   
  const[emptySec,setEmptySec] = useState([]);//store areas that are left empty while filling
  const[curCity,setCurCity] = useState();//Current city
  const[curState,setCurState] = useState();//Current State
  const[secState,setSecState] = useState([true,false,false]);
  const[secValid,setSecValid] = useState([false,false,false]);
  const[curPF,setCurPF] = useState('')// for parking facility
  const[curCF,setCurCF] = useState('')//for clockroom facility
  //set initial state and city
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
    if((window.location.href).split('/')[3] === 'update'){//if form page is in update mode
      if(secState[0] === true){
        setSecState([false,true,false]);
      }else if(secState[1] === true){
        setSecState([false,false,true]);
      }
    }
    if(secState[0] === true){
      const inputs = document.getElementById('section 0').querySelectorAll('input');
      const selects = document.getElementById('section 0').querySelectorAll('select');
      var res = true;
      var cnt = 0;
      Array.prototype.map.call(inputs,(input) =>{
        //validating
        if(input.value === "" && cnt !== 1 && cnt !== 3){
          input.style.border = '1px solid red';
          res = false;
        }else{
          input.style.border = '1px solid #CCCCCC';
        }
        cnt++;
      })
      //Validation check for select options 
      if(selects[0].value === 'Select..'){
        selects[0].style.border = '1px solid red';
        res = false;
      }else{
        selects[0].style.border = '1px solid #CCCCCC';
      }
      if(selects[1].value === 'Select..'){
        selects[1].style.border = '1px solid red';
        res = false;
      }else{
        selects[1].style.border = '1px solid #CCCCCC';
      }

      //final for next 
      if(res){
        setSecValid([...secValid,secValid[0] = true]);
        setSecState([false,true,false]);
      }else{
        setSecValid([...secValid,secValid[0] = false]);
      }
      
    }else if(secState[1] === true){
      const inputs = document.getElementById('section 1').querySelectorAll('input');
      var res = true;
      var cnt=0;
      Array.prototype.map.call(inputs,(input) =>{
        //validating
        if(input.value === ""){
          input.style.border = '1px solid red';
          res = false;
        }else if(cnt === 2 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input.value)){
          input.style.border = '1px solid red';
          res=false;
        }else if(cnt === 1 && input.value.length !== 10){
          input.style.border = '1px solid red';
          res=false;
        }
        else{
          input.style.border = '1px solid #CCCCCC';
        }
        cnt++;
      })
      if(res){
        setSecValid([...secValid,secValid[1] = true])
        setSecState([false,false,true]);
      }else{
        setSecValid([...secValid,secValid[1] = false]);
        setSecState([false,true,false])
      }
    }
  }

  const isValidation = (e)=>{
    setEmptySec([]);
    const inputs = document.querySelectorAll('input');
    var res = true;
    var cnt = 0;
    Array.prototype.map.call(inputs,(input) =>{
      //validating
      if(input.value === "" && cnt !== 1 && cnt !== 3){
        input.style.border = '1px solid red';
        setErrors(2);
        res = false;
      }
      else if(cnt === 18 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input.value)){
        input.style.border = '1px solid red';
        setErrors(4);
      }else if(cnt === 17 && input.value.length !== 10){
        input.style.border = '1px solid red';
      }else if(cnt !== 1 && cnt !== 3){
        input.style.border = '1px solid #CCCCCC';
      }
      cnt++;
    }) 
    return res;
  }

  const getCities=(e)=>{
    if(details){
      alert("You cannot update state or city")
    }else{
      setCurState(e);
      setCurCity("");
      setFC(Cities.filter(city => city.state_id === e.value));
    }
  }

  const getUserId =(token) => {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64)).user_id;
  }

//Submit Handler
 useEffect(()=>{
  const submit = async()=>{
    try {
        setErrors(0);
          await axiosJWT.post("http://localhost:5002/api/form",{
          column:column.toString(),
          values:values.toString()
          },{headers: {
              authorization: "Bearer " + user.accessToken,
          }});
        setIsSubmit(true);
        alert("success");
        window.location.replace(`/`)
      }catch(error){
        setErrors(1);
        console.log(error);
      }
  }
  if(column.length === 34){
    submit();
  }
  },[column])
  const handleSubmitData = () =>{
    var cnt = 0;
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll("select");
    //Setting column and value for submit
    setColumn(["user_id"]);
    setValues([getUserId(user.accessToken)]);
    Array.prototype.map.call(inputs,(input) =>{
      if(cnt !== 1 && cnt !== 3){
          if(input.type === 'number'){
            setValues((prev) =>[
              ...prev,(input.value)
            ]);
          }else{
            setValues((prev) =>[
              ...prev,("'"+(input.value).trim()+ "'")
            ]);
          }
          setColumn((prev)=>[
            ...prev,input.name
          ]);
      }
      cnt+=1;
    })  
    setColumn((prev)=>[
      ...prev,selects[0].name,selects[1].name
    ]); 
    setValues((prev) =>[
      ...prev,("'"+selects[0].value+ "'")
    ]);
    setValues((prev) =>[
      ...prev,("'"+selects[1].value+ "'")
    ]);
  }
  //post request related functions
  const submitForm = async(e)=>{
    setErrors(0);
    if(!isValidation(e)){
      window.scrollTo(0,0);
      setErrors(2);
      return -1;
    }else {
      handleSubmitData();
    }
  }

//update handler
useEffect(()=>{
  
  const updateFun = async()=>{
    try {
      //the valaue contain a string wiht format (cloumn_name = Value,.....)
      await axiosJWT.put(`http://localhost:5002/api/update/form?centre_id=${req.get("centre_id")}`,{
        details:values.toString()
      },{headers: {
        authorization: "Bearer " + user.accessToken,
      }})
      alert("Updates Successfully");
      window.location.replace('/');
    } catch (error) {
      console.log(error)
    }
  }
  if(values[34]){
    updateFun();
  }
},[values])
  const updateForm = async(e)=>{
    setErrors(0);
    if(!isValidation(e)){
      setErrors(2);
      return -1;
    }else{
      const inputs = document.querySelectorAll("input");
      const selects = document.querySelectorAll("select");
      var cnt = 0;
      setValues(["user_id" + "="+details.user_id]);
      Array.prototype.map.call(inputs,(input) =>{
        if(cnt !== 1 && cnt !== 3){
          if(input.type === 'number'){
            setValues((prev) =>[
              ...prev,(input.name + "=" + input.value)
            ]);
          }else{
            setValues((prev) =>[
              ...prev,(input.name + "=" + "'"+input.value+ "'")
            ]);
          }
        }
        cnt += 1;
      })
      setValues((prev) =>[
        ...prev,("is_approved" + "=" + null)
      ]);
      //for select inputs
      setValues((prev) =>[
        ...prev,(selects[0].name + "=" + "'"+selects[0].value+ "'")
      ]);
      setValues((prev) =>[
        ...prev,(selects[1].name + "=" + "'"+selects[1].value+ "'")
      ]);
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
          <div className={secState[0] ? 'sectionHeading active':'sectionHeading'} onClick={()=>secValid[0] && setSecState([true,false,false])} style ={secValid[0] == true ? {borderTop:'5px solid #00BA49'}:{borderTop:'none'}}>
            <span >CENTRE NAME AND ADDRESS</span>
          </div>
          <div className={secState[1] ? 'sectionHeading active':'sectionHeading'} onClick={()=>secValid[0] && setSecState([false,true,false])} style ={secValid[1] == true ? {borderTop:'5px solid #00BA49'}:{borderTop:'none'}}>
            <span>CENTRE CONTACT PERSON</span>
          </div>
            <div className={secState[2] ? 'sectionHeading active':'sectionHeading'} onClick={()=>secValid[1] && setSecState([false,false,true])}>
            <span>HARDWARE DETAILS</span>
          </div>
        </div>
        <div className='sectionInput'>
          {/*First From Section: centre Name And Address Info*/}
          <div className={secState[0] ? 'section  active':'section'} id='section 0'>
              <div style={{width:'98%',margin: '10px'}}>
                <label >Centre Name</label><br/>
                <input type="text" placeholder='Enter Centre Name' name="centre_name" defaultValue={details && details.centre_name} /><br/>
              </div>
              <div className='division'>
                <span>
                  <label >State</label><br/>
                  <Select options={states} className="selectBar" name="state" value={curState} onChange={getCities} /><br/>
                </span>
                <span>
                  <label >City</label><br/>
                  <Select options={fc} name="city" className="selectBar" value={curCity} onChange={(e)=>setCurCity(e)} /><br/>
                </span> 
                <span>
                  <label >Local Town</label><br/>
                  <input type="text" name="local_town" defaultValue={details && details.local_town} /><br/>
                </span>
                <span>
                  <label >Pincode</label><br/>
                  <input type="Number" name="pincode" defaultValue={details && details.pincode} minLength='6' maxLength='6' /><br/>
                </span>
              </div>   
              <div className='division'>  
                <span>
                  <label >Building Number & Name</label><br/>
                  <input type="text" name="buildingn_n" defaultValue={details && details.buildingn_n} /><br/>
                </span>
                <span>
                  <label >Street Number & Name</label><br/>
                  <input type="text" name="streetn_n" defaultValue={details && details.streetn_n}/><br/>
                </span>
                <span>
                  <label >Landmark</label><br/>
                  <input type="text" name="landmark" defaultValue={details && details.landmark} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label >Nearest Railway station Name</label><br/>
                  <input type="text" name="rail_stat_name" defaultValue={details && details.rail_stat_name} /><br/>    
                </span>
                <span>
                  <label >Distance</label><br/>
                  <input type="Number" name='rail_distance' defaultValue={details && details.rail_distance} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label >Nearest Bus station Name</label><br/>
                  <input type="text" name="bus_stat_name" defaultValue={details && details.bus_stat_name} /><br/>
                </span>
                <span>
                  <label >Distance</label><br/>
                  <input type="Number" name='bus_distance' defaultValue={details && details.bus_distance} /><br/>
                </span>
              </div>
              <div className='division'>
                <span>
                  <label>How Many Entry Point</label><br/>
                <input type="Number" name='entry_point' defaultValue={details && details.entry_point} /><br/>
                </span>
                <span>
                  <label>How Many Exit Point</label><br/>
                  <input type="Number" name='exit_point' defaultValue={details && details.exit_point} /><br/>
                </span>
                <span>
                  <label >Parking Facility</label><br/>
                    <select class="form-select" name='parking_facility' aria-label="Default select example" value={curPF} onChange={(e) => setCurPF(e.target.value)}>
                      <option style={{display: 'none'}} value = '-1'>Select..</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select><br/>
                </span>
                <span>
                  <label >Clockroom Facility</label><br/>
                  <select class="form-select" name='clockroom_facility' aria-label="Default select example" value={curCF} onChange={(e) => setCurCF(e.target.value)}>
                    <option style={{display: 'none'}} value = '-1'>Select..</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
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
                <input type="text" name="sup_name" defaultValue={details && details.sup_name} /><br/>
              </span>
              <span>
                <label >Contact No(Primary)</label><br/>
                <input type="text" name="contact_no" min={'10'} max={'10'} defaultValue={details && details.contact_no} /><br/>
              </span>
              <span>
                <label >Email</label><br/>
                <input type='email' name="email" defaultValue={details && details.email} placeholder='example@mail.com'/><br/>
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
                <input type="Number" name='total_system' defaultValue={details && details.total_system} /><br/>
              </span>
              <span>
                <label >Total No. of Lab</label><br/>
                <input type="Number" name="lab_cnt" defaultValue={details && details.lab_cnt} /><br/>
              </span>
              <span>
                <label >How Many Network</label><br/>
                <input type="Number" name="network_cnt" defaultValue={details && details.network_cnt} /><br/>
              </span>
              <span>
                <label >Fire Extinguisher</label><br/>
                <input type="Number" className='choiceInput' name="fire_ext" placeholder='Number of Fire Extinguisher'  defaultValue={details && details.fire_ext} /><br/>
              </span>
            </div>
            <div className="division 4">
              <span>
                <label>Partition in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name="lab_partition" placeholder='Ex- 4,10,15'  defaultValue={details && details.lab_partition} /><br/>
              </span>
              <span>
                <label >AC in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name='ac_cnt' placeholder='Ex - 2,4,10..'  defaultValue={details && details.ac_cnt} /><br/>
              </span>
              <span>
                <label >CCTV in Each Lab</label><br/>
                <input type="Number" className='choiceInput' name="no_of_cctv" placeholder='Ex - 2,5,11..'  defaultValue={details && details.no_of_cctv} /><br/>
              </span>
              <span>
                <label >Internet Speed</label><br/>
                <input type="Number" name="net_speed"  defaultValue={details && details.net_speed} /><br/>
              </span>
            </div>

            <div className="division 3">
              <span>
                <label>UPS[KVA]</label><br/>
                <input type="text" name='ups'  defaultValue={details && details.ups} /><br/>
              </span>
              <span>
                <label>UPS Backup(in Minutes)</label><br/>
                <input type="number" name='backup_ups1'  defaultValue={details && details.backup_ups1} /><br/>
              </span>
              <span>
                <label >Genset[KVA]</label><br/>
                <input type="text" name="genset"  defaultValue={details && details.genset} /><br/>
              </span>
            </div>

            <div className="division 3">
              <span>
                <label>Categories of Test Centre</label><br/>
                {/* <Select options={states} className="selectBar" name="state" value={curState} onChange={getCities}/><br/> */}
                <input type="text" className='choiceInput' name='test_categories' placeholder='Private or Government'  defaultValue={details && details.test_categories} /><br/>
              </span>
              <span>
                <label>UPS Backup(in Minutes)</label><br/>
                <input type="number" name='backup_ups2'  defaultValue={details && details.backup_ups2} /><br/>
              </span>
              <span>
                <label >Genset[KVA]</label><br/>
                <input type="text" name='getset2' defaultValue={details && details.getset2} /><br/>
              </span>
            </div>
            <div className='prevNextBtn'>
              <button type='button' onClick={()=>setSecState([false,true,false])}>Go back</button>
              {details ? <button type='button' onClick={updateForm}>Update</button>:
                <button type='button' onClick={submitForm}>Submit</button>}
            </div>
          </div>
        </div>  
      </div>
    </form>
  )
}

export default Form;
