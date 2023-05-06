import { client } from '../../db/db.js';
import { database } from '../../db/dbConfig.js';

export const getStatesG = async(req,res)=>{
    if(req.user.type != 'user'){
        client.query(`SELECT * from exam_state_master`,[],(err,data)=>{
            if(err) throw err;
            res.status(200).json(data.rows);
        })
    }else{
        res.status(403).json("Unauthorised")
    }
}