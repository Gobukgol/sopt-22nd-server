const express = require('express')
const router = express.Router()

const db = require('../../module/pool.js')

const moment = require('moment')

const jwt = require('../../module/jwt.js')

router.get('/:board_idx',async (req,res) => {
    let board_idx = req.params.board_idx

    if(!board_idx){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Null Value"
        })
    } else {
        let getCommentListQuery = 'SELECT * FROM comment WHERE board_idx = ?'
        let getCommentListResult = await db.queryParam_Arr(getCommentListQuery,[board_idx])

        if(!getCommentListResult){
            res.status(500).send({
                result : false,
                status : 500,
                message: "Internal Server Error!"
            })
        } else {
            res.status(200).send({
                result : true,
                status : 200,
                message: "Successfully load List",
                commentList : getCommentListResult
            })
        }
    }
})

router.post('/',async (req,res) => {
    let user_idx
    let board_idx = req.body.board_idx
    let comment_content = req.body.comment_content
    let comment_writetime =  moment().format('YYYY-MM-DD HH:mm:ss');
    let token = req.headers.user_token

    if(token === undefined || token === null){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Token value error!"
        })
    } else {
        if(!board_idx || !comment_content){
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
                user_idx = decoded.user_idx

                let insertQuery = 'INSERT INTO comment (user_idx,board_idx,comment_content,comment_writetime) VALUES (?,?,?,?)'
                let insertResult = await db.queryParam_Arr(insertQuery,[user_idx,board_idx,comment_content,comment_writetime])
        
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
                        message : "Successfully write comment"
                    })
                }
            }
        }
    }
})

router.delete('/:comment_id',async (req,res) => {
    let comment_id = req.params.comment_id

    if(!comment_id){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Null Value"
        })
    } else {
        let checkQuery = 'SELECT * FROM comment WHERE comment_id = ?'
        let checkResult = await db.queryParam_Arr(checkQuery,[comment_id])

        if(!checkResult){
            res.status(500).send({
                result : false,
                status : 500,
                message : "Internal Server Error!"
            })
        } else if(checkResult.length === 1){
            let deleteQuery = 'DELETE FROM comment WHERE comment_id = ?'
            let deleteResult = await db.queryParam_Arr(deleteQuery,[comment_id])

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
                    message : "Successfully Delete comment"
                })
            }
        } else {
            res.status(400).send({
                result : false,
                status : 400,
                message : "Comment_id Error!"
            })
        }
    }
})

module.exports = router