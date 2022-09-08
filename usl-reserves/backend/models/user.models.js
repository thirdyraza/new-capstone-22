const mongoose = require('mongoose')

const User = new mongoose.Schema ({
    idnum: {type: String, required: true, unique: true},
    pass: {type: String, required: true},
    role: {type: Number, required: true},
},
{ collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

module.exports = model