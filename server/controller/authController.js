import {client} from '../db/db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { database } from '../db/dbConfig.js';
import { generateAccessToken,generateRefreshToken } from '../Middleware/jwtControllers.js';
import fetch from 'node-fetch'
dotenv.config();

const RH_TABLE = process.env.RH_TABLE;
const USER_TABLE = process.env.USER_TABLE;

export const register =async (req,res)=>{
    const username = req.body.username;
    const salt =await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password,salt);
    try {
        client.query(`SELECT * FROM ${USER_TABLE} WHERE username = '${username}'`,[],(err,data)=>{
            if(err) throw err;
            if(data.rows[0]){
                res.status(401).json("User Already present");
            }else{
                client.query(`INSERT INTO ${USER_TABLE} (username,password) VALUES ('${username}','${hashedPass}')`,[],(err,data)=>{
                    if(err)throw err;
                    else{
                        res.status(200).json("User Created");
                    }     
                })
            }
        })  
    } catch (error) {
        res.status(500).json(error);
    }
}

export const login =async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try {//rh_login credential check
        client.query(`SELECT * FROM ${RH_TABLE} WHERE rh_username = '${username}'`,[],async(err,data)=>{
            if(err) throw err;
            if(data.rows[0]){
                const validate = await bcrypt.compare(password,data.rows[0].rh_password);
                if(!validate){
                    res.status(401).json("Password incorrect");
                }else{
                    //Jwt token generation
                    const accessToken = generateAccessToken(data.rows[0]);
                    const refreshToken = generateRefreshToken(data.rows[0]);
                    res.status(200).json({
                        username:data.rows[0].rh_username,
                        type:"rh",
                        accessToken,
                        refreshToken
                    });
                }
            }else{//if rh not found then user credential check
                try {
                    client.query(`SELECT * FROM ${USER_TABLE} WHERE username = '${username}'`,[],async(err,data)=>{
                        if(err) throw err;
                        if(data.rows[0]){
                            const validate = await bcrypt.compare(password,data.rows[0].password);
                            if(!validate){
                                res.status(401).json("Password incorrect");
                            }else{
                                //Jwt token generation
                                const accessToken = generateAccessToken(data.rows[0]);
                                const refreshToken = generateRefreshToken(data.rows[0]);
                                res.status(200).json({
                                    username:data.rows[0].username,
                                    type:data.rows[0].is_admin ? 'admin':'user',
                                    accessToken,
                                    refreshToken
                                });
                            }
                        }   
                        else{
                            res.status(400).json("Username not found!");
                        }
                    })
                } catch (error) {
                    res.status(500).json(error);
                }
            }   
        })
    } catch (error) {
        res.status(500).json(error);
    }
}


export const regenerateAccessToken = async(req,res)=>{
  //take the refresh token from user
  const refreshToken = req.body.token;
  if(!refreshToken) return res.status(401).json('You are not authenticated!');

  //if everything is ok create new access token ,refresh token and send to user
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    const newAccessToken = jwt.sign({ user_id:user.user_id, 
                  type:user.type,
                  username:user.username},
        "mySecretKey", {expiresIn: "30m",}
    );
    const newRefreshToken = jwt.sign({ user_id:user.user_id, 
                  type:user.type,
                  username:user.username},
        "myRefreshSecretKey", {expiresIn: "2h",}
    );

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
}

//Verify Captcha
export const verifyCaptcha = async(req,res)=>{
    const url =`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.Recaptcha_SECRET_KEY}&response=${req.body.token}`;
 
  // Making POST request to verify captcha
  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
 
      // google_response is the object return by
      // google as a response
      if (google_response.success == true) {
        //   if captcha is verified
        return res.status(200).json({status:true});
      } else {
        // if captcha is not verified
        return res.status(200).json({status:false});
      }
    })
    .catch((error) => {
        // Some error while verify captcha
      return res.json({ error });
    });
}

