const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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
            res.json({ status: 'invalPass'})
        }
    } else{
        res.json({status: 'unknownID'})
    }
    
})

console.log(mongoose.connection.readyState);

// establishing PORT + testing
app.listen(2301, () => {
    console.log('server is running at 2301');
})