const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        trim:true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: Number,
        default:0
    },
}, {
    timestamps:true
})

module.exports = mongoose.model('Recruiters', recruiterSchema);