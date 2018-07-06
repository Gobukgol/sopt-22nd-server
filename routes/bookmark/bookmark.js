const express = require('express')
const router = express.Router()

const db = require('../../module/pool.js')

const jwt = require('../../module/jwt.js')

router.post('/',async (req,res) => {
    let user_idx
    let board_idx = req.body.board_idx
    let token = req.headers.user_token
    
    if(token === undefined || token === null){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Token Value Error"
        })
    } else {
        if(!board_idx){
            res.status(400).send({
                result : false,
                status : 400,
                message : "Null Value"
            })
        } else {
            let decoded = jwt.verify(token)

            if(decoded == -1){
                res.status(500).send({
                    result : false,
                    status : 500,
                    message : "Token Decode Error!"
                })
            } else {
                
            let checkQuery = 'SELECT * FROM bookmark WHERE board_idx = ? AND user_idx = ?'
            let checkResult = await db.queryParam_Arr(checkQuery,[board_idx,user_idx])
    
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
                    message : "Already bookmark"
                })
            } else {
                user_idx = decoded.user_idx

                let insertQuery = 'INSERT INTO bookmark (user_idx,board_idx) VALUES (?,?)'
                let insertResult = await db.queryParam_Arr(insertQuery,[user_idx,board_idx])
    
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
                        message : "Successfully Bookmarked"
                    })
                }
            }
            }
        }
    }
})

router.delete('/',async (req,res) => {
    let user_idx
    let board_idx = req.body.board_idx
    let token = req.headers.user_token

    if(token === undefined || token === null){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Token Value Error"
        })
    } else {
        if(!board_idx){
            res.status(500).send({
                result : false,
                status : 500,
                message : "Internal Server Error!"
            })
        } else {
            let decoded = jwt.verify(token)

            if(decoded == -1){
                res.status(500).send({
                    result : false,
                    status : 500,
                    message : "Token Decode Error!"
                })
            } else {
                user_idx = decoded.user_idx

                let checkQuery = 'SELECT * FROM bookmark WHERE user_idx = ? AND board_idx = ?'
                let checkResult = await db.queryParam_Arr(checkQuery,[user_idx,board_idx])
    
                if(!checkResult){
                    res.status(500).send({
                        result : false,
                        status : 500,
                        message : "Internal Server Error!"
                    })
                } else if(checkResult.length === 0){
                    res.status(400).send({
                        result : false,
                        status : 400,
                        message : "Already deleted"
                    })
                } else {
                    let deleteQuery = 'DELETE FROM bookmark WHERE user_idx = ? AND board_idx = ?'
                    let deleteResult = await db.queryParam_Arr(deleteQuery,[user_idx,board_idx])
    
                    if(!deleteResult){
                        res.status(500).send({
                            result : false,
                            status : 500,
                            message : "Internal Server Error!"
                        })
                    } else {
                        res.status(200).send({
                            result : true,
                            status : 200,
                            message : "Successfully deleted"
                        })
                    }
                }
            }
        }
    }
})

module.exports = router