require('dotenv').config();
var express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path');
const Jobs = require('./models/jobModel');
const cors = require('cors');
var app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// connect to MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err)throw err;
    console.log('Connected to MongoDB');
})

// Routes
app.use('/candidate', require('./routes/candidateRouter'));
app.use('/recruiter', require('./routes/recruiterRouter'));


app.get("/", (req, res)=>{
    var openJobs = [];
    Jobs.find({}, function(err, jobs){
        if(err){
            console.log(err);
        } else{
            jobs.forEach((job)=>{
                if(job.status==="open"){
                    openJobs.push(job);
                }
            })
            res.json({openJobs});
        }
    })
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT);
})


