const Candidates = require("../models/candidateModel");
const Applications = require("../models/applicationModel");
const Jobs = require("../models/jobModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const candidateCtrl = {

    signup : async(req, res) =>{
        try{

            const {name, email, password} = req.body;
            const candidate = await Candidates.findOne({email})
            if(candidate) return res.status(400).json({msg: "The email already exists"});

            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 characters"})
            
            // Password Encryption
            const passwordHash = await bcrypt.hash(password,10);
            const newCandidate = new Candidates({
                name, email, password:passwordHash
            })

            // Save in db
            await newCandidate.save();
     
           // Create jsonWebToken to authenticate
           const accesstoken = createAccessToken({id: newCandidate._id});
           const refreshtoken = createRefreshToken({id: newCandidate._id});

           res.cookie('refreshtoken', refreshtoken, {
               httpOnly: true,
               path: '/candidate/refresh_token',
           })

           res.json({accesstoken});

        } catch(err){
            return res.status(500).json({msg:err.message})
        }
    },

    login : async(req, res) =>{
        
        try{
            const {email, password} = req.body;

            const candidate = await Candidates.findOne({email})
            if(!candidate)return res.status(400).json({msg:"Candidate doesn't exist"})

            const isMatch = await bcrypt.compare(password, candidate.password);
            if(!isMatch) return res.status(400).json({msg:"Incorrect password."})

            // if login success, create access token and refresh token
            const accesstoken = createAccessToken({id: candidate._id});
            const refreshtoken = createRefreshToken({id: candidate._id});

            res.cookie('refreshtoken', refreshtoken, {
               httpOnly: true,
               path: '/candidate/refresh_token',
            })

            res.json({accesstoken});

        }catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    logout : async(req, res) =>{
        try{
            res.clearCookie('refreshtoken', {path: '/candidate/refresh_token'});
  
            return res.json({msg:"Logged out"});
  
  
          } catch(err){
              return res.status(500).json({msg:err.msg})
          }
    },

    refreshToken: (req, res) =>{

        try{
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token)return res.status(400).json({msg:'Please Login or Register'})
            
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, candidate) => {
                if(err) return res.status(400).json({ msg: "Please Login or register" });
                
                const accesstoken = createAccessToken({ id: candidate.id });
        
                res.json({ candidate, accesstoken });
              });

        } catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    getCandidate: async(req, res) => {
        try{
            const candidate = await Candidates.findById(req.user.id).select('-password');
            if(!candidate) return res.status(400).json({msg:"Candidate doesn't exist"})
            
            res.json(candidate);

        }catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    getAppliedJobs : async(req, res) =>{
        try{
            const candidate = await Candidates.findById(req.user.id);
            if(!candidate) return res.status(400).json({msg:"Candidate doesn't exist"})

            const appliedJobs = await Applications.find({candidate_id:candidate._id});
            
            // Candidates can use a 3rd party service to create a draft of all the applied jobs.

            return res.json({appliedJobs});
            
        } catch(err){
            return res.status(500).json({msg:err.msg});
        }
    },

    apply : async(req, res) => {

        try{
            const candidate = await Candidates.findById(req.user.id);
            if(!candidate) return res.status(400).json({msg:"Candidate doesn't exist"})

            const {job_id} = req.body;

            const job = await Jobs.find({job_id:job_id});


            const newApplication = new Applications({
                job_id, 
                candidate_id: candidate._id,
                recruiter_id: job[0].recruiter_id
            })

            // We can use a 3rd Party API like Mailgun to send e-mail to Recruiter using recruiter-id. 

            // Save in DB
            await newApplication.save();

            return res.json({ msg: "Added to Applied Jobs" });

        } catch(err){
            return res.status(500).json({msg:err.msg});
        }
    },

    deleteJob : async(req, res) =>{
        try{
            const candidate = await Candidates.findById(req.user.id);
            if(!candidate) return res.status(400).json({msg:"Candidate doesn't exist"})

            const {job_id} = req.body;

            await Applications.remove({job_id: job_id})

            return res.json({ msg: "Deleted Successfully" });


        } catch(err){
            return res.status(500).json({msg:err.msg});
        }
    }

}

// Functions to create tokens for users for their persistent session

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = candidateCtrl;