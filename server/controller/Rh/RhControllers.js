import { client } from "../../db/db.js";
import { database } from "../../db/dbConfig.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const RH_TABLE = process.env.RH_TABLE;


export const rh_register =async (req,res)=>{
    const rh_username = req.body.username;
    const salt =await bcrypt.genSalt(10);
    const hashedPass =await bcrypt.hash(req.body.password,salt);

    try {
        client.query(`SELECT * FROM ${RH_TABLE} WHERE rh_username = '${rh_username}'`,[],(err,data)=>{
            if(err) throw err;
            if(data.rows[0]){
                res.status(401).json("RH Already present.Enter a different rh_username");
            }else{
                client.query(`INSERT INTO ${RH_TABLE} (rh_username,rh_password) VALUES ('${rh_username}','${hashedPass}')`,[],(err,data)=>{
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

