//centre Details Controller
import { client } from '../../db/db.js';
import { database } from '../../db/dbConfig.js';
import dotenv from 'dotenv';
dotenv.config();

const TABLE_NAME = process.env.TABLE_NAME
const RH_TABLE = process.env.RH_TABLE;
const USER_TABLE = process.env.USER_TABLE;

//To get all the Approved or Rejected centres
export const getApprovedcentre = async(req,res)=>{
    if(req.user.type == 'admin'){
        try {
            client.query(`select * from ${TABLE_NAME} where is_approved = true`,[],(err,data)=>{
                if(err) throw err
                res.status(200).json(data.rows);
            })
        } catch (error) {
            res.status(500).json('Failed to get approved centres')
        }
    }else if(req.user.type == 'rh'){
        try {
            client.query(`select * from ${TABLE_NAME} where is_approved = true and status_change_by = 'RH ${req.user.username}'`,[],(err,data)=>{
                if(err) throw err
                res.status(200).json(data.rows);
            })
        } catch (error) {
            res.status(500).json('Failed to get approved centres')
        }
    }else{
        res.status(403).json('Unauthorised');
    }
}

export const getRejectedcentre = async(req,res)=>{
    if(req.user.type == 'admin'){
        try {
            client.query(`select * from ${TABLE_NAME} where is_approved = false`,[],(err,data)=>{
                if(err) throw err
                res.status(200).json(data.rows);
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }else if(req.user.type == 'rh'){
        try {
            client.query(`select * from ${TABLE_NAME} where is_approved = false and status_change_by = 'RH ${req.user.username}'`,[],(err,data)=>{
                if(err) throw err
                res.status(200).json(data.rows)
            })
        } catch (error) {
            res.status(500).json('Failed to get approved centres')
        }
    }else{
        res.status(403).json('Unauthorised');
    }
}

//To Reject and Approve centres by Admin(Only Reject) and RegionalHead(Approve and Reject)
export const rejectcentre = async(req,res)=>{
    const centre_id = req.body.centre_id;
    try {
        if(req.user.type == 'admin'){
            client.query(`UPDATE ${TABLE_NAME} set is_approved = false,status_change_by ='Admin ${req.user.username}' where centre_id = $1`,[centre_id],(err,data)=>{
                if(err) throw err;
                res.status(200).json('Centre Rejected');
            })
        }else if(req.user.type == 'rh'){
            client.query(`select is_approved,status_change_by from ${TABLE_NAME} where centre_id = $1`,[centre_id],(err,data)=>{
                if(err) throw err;
                const result = data.rows[0];
                if(result && result.is_approved == true && result.status_change_by.split(' ')[0] === 'Admin'){
                    res.status(401).json(`Can't Reject ,Approved by ${result.status_change_by}`);
                }
                else if(result.is_approved != false || result.is_approved != true){
                    client.query(`UPDATE ${TABLE_NAME} set is_approved = false, status_change_by ='RH ${req.user.username}' where centre_id = $1`,[centre_id],(err,data)=>{
                        if(err) throw err;
                        res.status(200).json('Centre Rejected');
                    })
                }
                else{
                    res.status(403).json("Uncaught error")
                }
            })
        }
        else{
            res.status(403).json('Unauthorised')
        }
    }
    catch (error) {
        res.status(500).json({error,message:"Failed"})
    }
}

export const approvecentre = async(req,res)=>{
    const centre_id = req.body.centre_id;
    try {
        if(req.user.type === 'admin'){
            client.query(`UPDATE ${TABLE_NAME} set is_approved = true,status_change_by ='Admin ${req.user.username}' where centre_id = $1`,[centre_id],(err,data)=>{
                if(err) throw err;
                else res.status(200).json("Centre Approved by Admin");
            })
        }
        else if(req.user.type === 'rh'){
            client.query(`select is_approved,status_change_by from ${TABLE_NAME} where centre_id = $1`,[centre_id],(err,data)=>{
                if(err) throw err;
                const result = data.rows[0];
                if(result && result.is_approved === false && result.status_change_by.split(' ')[0] === 'Admin'){
                    res.status(401).json(`Can't Approve ,Rejected by ${result.status_change_by}`);
                }
                else{
                    client.query(`UPDATE ${TABLE_NAME} set is_approved = true,status_change_by ='RH ${req.user.username}' where centre_id = $1`,[centre_id],(err,data)=>{
                        if(err) throw err;
                        res.status(200).json("Centre Approved");
                    })
                }  
            })
        }
        else{
            res.status(403).json("Unauthorised")
        }
    }
    catch (error) {
        res.status(500).json({error,message:"Failed"})
    }
}

//admin register Done by Developer
// export const adminRegister =async (req,res)=>{
//     const username = req.body.username;
//     const salt =await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(req.body.password,salt);
//     try {
//         client.query(`SELECT * FROM ${USER_TABLE} WHERE username = '${username}'`,[],(err,data)=>{
//             if(err) throw err;
//             if(data.rows[0]){
//                 res.status(401).json("User Already present");
//             }else{
//                 client.query(`INSERT INTO ${USER_TABLE} (username,password,is_admin) VALUES ('${username}','${hashedPass}','true')`,[],(err,data)=>{
//                     if(err)throw err;
//                     else{
//                         res.status(200).json("User Created");
//                     }     
//                 })
//             }
//         })  
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }


//Function to change status of the centre (approve/reject/In Process)

export const changeStatus = async (req,res)=>{
    const centre_id = req.body.centre_id;
    try {
        if(req.user.type === 'admin'){
            client.query(`update ${TABLE_NAME} set is_approved = null,status_change_by = null where centre_id = $1`,[centre_id],(err,data)=>{
                if(err) throw err;
                res.status(200).json('Status Changed!');
            })
        }else{
            res.status(402).json('Unauthorized')
        }
    } catch (error) {
        res.status(500).json(error);
    }
}


