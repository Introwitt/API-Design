const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    candidate_id:{
        type: String,
        required: true,
        trim:true,
    },

    job_id:{
        type: String,
        required: true,
        trim:true
    },

    recruiter_id:{
        type: String,
        required: true,
        trim: true,
    },

    status:{
        type: String,
        default: "pending",
        required: true,
    },

    remarks:{
        type: String,
        default: "lorem ipsum",
        required: true
    }

}, {timestamps:true})

module.exports = mongoose.model('Applications', applicationSchema);
