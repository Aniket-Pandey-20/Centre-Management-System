import axios from "axios";
//For getting Categories of centre
export const getcentre =async() =>(await axios.get("http://localhost:5002/api/centre_type").catch(error =>{
    console.log(error.data.name);
}));

//For getting states
export const statesFunction =async() =>(await axios.get("http://localhost:5002/api/states").catch(error =>{
    console.log(error.data.name);
}));

//For getting cities

export const cityFunction =async() =>(await axios.get("http://localhost:5002/api/cities").catch(error =>{
    console.log(error.data.name);
}));