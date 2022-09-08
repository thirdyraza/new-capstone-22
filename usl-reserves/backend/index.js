const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./models/user.models')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// middlewares
app.use(cors())
app.use(express.json())

// mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/usl-reserves')

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        idnum: req.body.idnum,
    })

    if(user) {
        const isPassValid = await bcrypt.compare(req.body.pass, user.pass)

        if(isPassValid){
            const token = jwt.sign({
                idnum: user.idnum,
                pass: user.pass,
            }, '21975232')
            res.json({ status: 'success', user : token})
        } else {
            res.json({ status: 'error'})
        }
    } else{
        res.json({status: 'error'})
    }
    
})

app.post('/api/register', async (req, res) => {

    try{
        const matchID = await User.findOne({ // finding for ID matches
            idnum: req.body.idnum
        })
        
        if (!matchID){ // no matches found
            const encryptPass = await bcrypt.hash(req.body.pass, 10)
                    await User.create({
                        idnum: req.body.idnum,
                        pass: encryptPass,
                        role: req.body.role
                    })
                    return res.json({ status: 'success' })
        } else {
            return res.json({status: 'error'})
        }
    }catch (err){
        return res.json({status: 'error'})
    } 
})


console.log(mongoose.connection.readyState);

// establishing PORT + testing
app.listen(2301, () => {
    console.log('server is running at 2301');
})