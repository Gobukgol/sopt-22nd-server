const express = require('express')
const router = express.Router()

const db = require('../../module/pool.js')
const upload = require('../../config/multer.js')

const moment = require('moment')

const jwt = require('../../module/jwt.js')

router.get('/',async (req,res) => {
    let getListQuery = 'SELECT * FROM board ORDER BY board_idx DESC'
    let getListResult = await db.queryParam_None(getListQuery)

    if(!getListResult){
        res.status(500).send({
            result : false,
            status : 500,
            message : "Internal Server Error!"
        })
    } else {
        res.status(200).send({
            result : true,
            status : 200,
            message : "Successfully get List",
            list : getListResult
        })
    }
})

router.post('/',upload.single('board_image'),async (req,res) => {
    //let user_idx = req.body.user_idx
    let user_idx
    let token = req.headers.user_token
    let board_title = req.body.board_title
    let board_content = req.body.board_content
    let board_image
    if(!req.file){
        board_image = null
    } else {
        board_image = req.file.location
    }

    if(token === undefined || token === null){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Token value error!"
        })
    } else {
        if(!board_title || !board_content){
            res.status(400).send({
                result : false,
                status : 400,
                message : "Null Value!"
            })
        } else {
            let decoded = jwt.verify(token)
    
            if(decoded == -1){
                res.status(500).send({
                    result : false,
                    status : 500,
                    message : "Token Decoded Error!"
                })
            } else {
                user_idx = decoded.user_idx
                let board_writetime = moment().format('YYYY-MM-DD HH:mm:ss');
                let insertBoardQuery = 'INSERT INTO board (user_idx,board_title,board_content,board_writetime,board_image) VALUES (?,?,?,?,?)'
                let insertBoardResult = await db.queryParam_Arr(insertBoardQuery,[user_idx,board_title,board_content,board_writetime,board_image])
        
                if(!insertBoardResult){
                    res.status(500).send({
                        result : false,
                        status : 500,
                        message : "Internal Server Error!"
                    })
                } else {
                    res.status(201).send({
                        result : true,
                        status : 200,
                        message : "Successfully regist board"
                    })
                }
            }
        }
    }
})

router.delete('/:board_idx',async (req,res) => {
    let board_idx = req.params.board_idx
    
    if(!board_idx){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Null Value!"
        })
    } else {
        let checkQuery = 'SELECT * FROM board WHERE board_idx = ?'
        let checkResult = await db.queryParam_Arr(checkQuery,[board_idx])

        if(!checkResult){
            res.status(500).send({
                result : false,
                status : 500,
                message : "Internal Server Error!"
            })
        } else if(checkResult.length === 1){
            let deleteQuery = 'DELETE FROM board WHERE board_idx = ?'
            let deleteResult = await db.queryParam_Arr(deleteQuery,[board_idx])

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
                    message : "Successfully delete board"
                })
            }
        } else {
            res.status(400).send({
                result : false,
                status : 400,
                message : "Board_idx Error!"
            })
        }
    }
    
})

module.exports = router