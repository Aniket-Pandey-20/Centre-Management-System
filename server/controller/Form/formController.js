import {client} from '../../db/db.js';
import dotenv from 'dotenv';
dotenv.config();

const TABLE_NAME = process.env.TABLE_NAME;
const USER_TABLE = process.env.USER_TABLE;

export const insertDetails = (req,res)=>{
    try {
        const details = req.body;
        if(!details){
            res.state(401).json("Details not found");
        }else if(req.user.user_id == details.values.split(",")[0]){
            client.query(`Select centre_name from ${TABLE_NAME} where centre_name = $1`,[details.values.split(",")[1]],(err,data)=>{
                if(err) throw err
                if(data.rows.length === 0){
                    var queryStr = `INSERT INTO ${TABLE_NAME} (${details.column}) VALUES (${details.values})`;
                    client.query(queryStr,[],(err,data)=>{
                        if(err) throw err
                        //Increasing state centre count
                        client.query(`update exam_state_master set state_centre_cnt = state_centre_cnt + 1 where state_id = ${details.values.split(",")[2]}`,[],(err,data)=>{
                            if(err) throw err;
                        })
                        res.status(200).json("Inserted");
                    })
                }else{
                    res.status(404).json('Operation Falied')
                }
            })
        }else{
            res.status(403).json("Can't insert....Access denied!!(Cause:Unauthorised)")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getDetails = (req,res)=>{
    try {
        if(req.query.username){
            client.query(`SELECT centre_id,centre_name,is_approved,state FROM ${TABLE_NAME} WHERE user_id = $1`,[req.user.user_id],(err,data)=>{
                if(err){
                    throw err;
                }else if(data.rows.length !==0){
                    if(req.query.username === req.user.username){
                        res.status(200).json(data.rows);
                    }else{
                        res.status(403).json("Access denied!!(Cause:Unauthorised)")
                    }
                }else{
                    res.status(200).json(0);
                } 
            })
        }else if(req.query.centre_id){
            client.query(`SELECT * FROM ${TABLE_NAME} WHERE centre_id = $1`,[req.query.centre_id],(err,data)=>{
                if(err){
                    throw err;
                }else if(req.user.user_id === data.rows[0].user_id || req.user.type === "admin"){
                    res.status(200).json(data.rows[0]);
                }else{
                    res.status(403).json("Access denied!!(Cause:Unauthorised)")
                }
            })
        }else if(req.user.type != 'user'){
            client.query(`SELECT * FROM ${TABLE_NAME}`,(err,data)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json(data.rows);
            }
            })
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const deleteDetails = (req,res)=>{
    const id = req.query.centre_id;
    const state_id = req.query.state;
    client.query(`SELECT user_id FROM ${TABLE_NAME} WHERE centre_Id=$1`,[id],(err,data)=>{
        if(err) throw err;

        if(req.user.type == 'admin' || req.user.type == 'rh' || data.rows[0].user_id === req.user.user_id){
            try {
            client.query(`DELETE FROM ${TABLE_NAME} WHERE centre_id =$1`,[id],(err,data)=>{
                if(err) throw err;
                client.query(`update exam_state_master set state_centre_cnt = state_centre_cnt - 1 where state_id = ${state_id}`,[],(err,data)=>{
                    if(err) throw err;
                    res.status(200).json("Deleted");
                })
            });
            } catch (error) {
                res.status(500).json({error,message:"Failed to delete"});
            }
        }else{
            res.status(403).json("You are not allowed to delete this!....")
        }
    })
}

export const updateDetails = (req,res)=>{
    const id = req.query.centre_id;
    const details = req.body.details;
    client.query(`SELECT user_id FROM ${TABLE_NAME} WHERE centre_id=$1`,[id],(err,data)=>{
        if(err) throw err;

        if(req.user.type === 'admin' || data.rows[0].user_id === req.user.user_id){
            try {
            client.query(`UPDATE ${TABLE_NAME} SET ${details} WHERE centre_id=($1)`,[id],(err,data)=>{
                if(err) throw err;

                res.status(200).json("Details Updates");
            })
            } catch (error) {
                res.status(500).json({error,message:"Failed to Update"});
            }
        }else{
             res.status(403).json("Access denied to update!!(Cause:Unauthorised)");
        }
    })
}

