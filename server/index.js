import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { verify } from './Middleware/jwtControllers.js';
import { getDetails, insertDetails, deleteDetails, updateDetails } from './controller/Form/formController.js'
import { getcentreType, getCities,getStates } from './controller/Form/getC_S_CT.js';
import { getStatesG } from './controller/Admin/graphDataContorller.js';
import { login,register,regenerateAccessToken, verifyCaptcha} from './controller/authController.js';
import {approvecentre, getApprovedcentre, getRejectedcentre, rejectcentre,changeStatus } from './controller/Admin/CD_Controller.js';
import { rh_register } from './controller/Rh/RhControllers.js';
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.post("/api/form",verify,insertDetails);
app.get('/api/get',verify,getDetails);//get all the centre registered by loged-in user
app.get('/api/form',verify,getDetails);//get details of particular form fields
app.delete('/api/delete',verify,deleteDetails);
app.put('/api/update/form',verify,updateDetails);
app.post('/api/auth/login',login);
app.post('/api/auth/register',register);

//for state and cities
app.get("/api/cities",getCities);
app.get("/api/states",getStates);
//for centre categories
app.get('/api/centre_type',getcentreType)

//admin page requests
app.get('/api/admin/graph/states',verify,getStatesG);  //States for graph
app.get('/api/admin/approvedcentre',verify,getApprovedcentre);
app.get('/api/admin/rejectedcentre',verify,getRejectedcentre);

//Reject and approve centre
app.put('/api/reject',verify,rejectcentre);
app.put('/api/approve',verify,approvecentre);

//Change Status
app.put('/api/changeStatus',verify,changeStatus);

//Rh register
app.post(`/api/auth/rh/register`,rh_register);

//Refresh access & refresh token
app.post('/api/refresh',regenerateAccessToken);

//Verify ReCaptcha TOoken
app.post('/api/auth/verifyCaptchaToken',verifyCaptcha);

app.listen(5002,()=>{
    console.log(`Server is running in port http://localhost:${5002}`);
});

