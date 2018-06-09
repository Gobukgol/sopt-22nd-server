const express = require('express')
const router = express.Router();

const crypto = require('crypto-promise')
const db = require('../../module/pool.js')

router.post('/',async (req,res) => {
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    if(!user_id || !user_pw){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Null Value"
        })
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?'
        let checkResult = await db.queryParamm_Arr(checkQuery,[user_id]);

        if(!checkResult){
            res.status(500).send({
                result : false,
                status : 500,
                message : "Internal Server Error!"
            })
        } else if(checkResult.length === 1){
            res.status(400).send({
                result : false,
                status : 400,
                message : "Already Exists ID"
            })
        } else {
            let salt = await crypto.randomBytes(32);
            let hashed = await crypto.pbkdf2(user_pw,salt.toString('base64'),100000,32,'sha512')

            let insertQuery = 'INSERT INTO user (user_id,user_pw,user_salt) VALUES (?,?,?)'
            let insertResult = await db.queryParamm_Arr(insertQuery,[user_id,hashed.toString('base64'),salt.toString('base64')]);

            if(!insertResult){
                res.status(500).send({
                    result : false,
                    status : 500,
                    message : "Internal Server Error!"
                })                
            } else {
                res.status(201).send({
                    result : true,
                    status : 201,
                    message : "Successfully sign up"
                })
            }
        }
    }
})

module.exports = router