import {client} from '../../db/db.js';

export const getCities =async (req,res)=>{
    try {
        client.query("select city_name as label,city_id as value,state_id from exam_city_master",[],(err,data)=>{
            if(err) throw err;
            res.status(200).json(data.rows);
        })
    } catch (error) {
        res.status(500).json(error);
    }
}


export const getStates =async (req,res)=>{
    try {
        await client.query("select state_name as label,state_id as value from exam_state_master",[],(err,data)=>{
            if(err) throw err;
            res.status(200).json(data.rows);
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getcentreType =async (req,res)=>{
    try {
        await client.query("select centre_type from test_centre_cat",[],(err,data)=>{
            if(err) throw err;
            res.status(200).json(data.rows);
        })
    } catch (error) {
        res.status(500).json(error);
    }
}