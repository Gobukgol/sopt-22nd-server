const express = require('express')
const router = express.Router()

const crypto = require('crypto-promise')
const db = require('../../module/pool.js')

const jwt = require('../../module/jwt.js')

router.post('/',async (req,res)=>{
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    if(!user_id || !user_pw){
        console.log('Sign in : Null value')
        res.status(500).send({
            result : false,
            status : 500,
            message : "Null Value"
        });
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?'
        let checkResult = await db.queryParam_Arr(checkQuery,[user_id]);

        if(!checkResult){
            res.status(500).send({
                result : false,
                status : 500,
                message : "Internal Server Error!"
            })
        } else if(checkResult.length === 1){
            let hashed = await crypto.pbkdf2(user_pw,checkResult[0].user_salt,100000,32,'sha512')
            if(hashed.toString('base64') === checkResult[0].user_pw){
                let token = jwt.sign(checkResult[0].user_idx)
                res.status(201).send({
                    result : true,
                    status : 201,
                    message : "Login Success",
                    token : token
                })
            } else {
                console.log("PW error!")
                res.status(400).send({
                    result : false,
                    status : 400,
                    message : "Login Failed!"
                })              
            }
        } else {
            console.log("ID error!")
            res.status(400).send({
                result : false,
                status : 400,
                message : "Login Failed!"
            })
        }
    }
})

module.exports = router