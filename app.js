require('dotenv').config();
var express = require("express");
const mongoose = require("mongoose");
var app = express();

app.use(express.json());


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
    res.send("Home Page");
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
})