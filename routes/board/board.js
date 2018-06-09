const express = require('express')
const router = express.Router()

const db = require('../../module/pool.js')
const upload = require('../../config/multer.js')

const moment = require('moment')

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
    let user_idx = req.body.user_udx
    let board_title = req.body.board_title
    let board_content = req.body.board_content
    let board_image
    if(!req.files){
        board_image = null
    } else {
        board_image = req.file.location
    }

    if(!user_idx || !board_title || !board_content){
        res.status(400).send({
            result : false,
            status : 400,
            message : "Null Value!"
        })
    } else {
        let board_writetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let insertBoardQuery = 'INSERT INTO board (user_idx,board_title,board_content,board_writetime,board_image)'
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
})

router.delete('/:board_idx',async (req,res) => {
    
})

module.exports = router