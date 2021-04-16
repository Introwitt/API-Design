const Recruiters = require("../models/recruiterModel");
const Applications = require("../models/applicationModel");
const Jobs = require("../models/jobModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const recruiterCtrl = {

    signup : async(req, res) =>{
        try{

            const {name, email, password} = req.body;
            const recruiter = await Recruiters.findOne({email})
            if(recruiter) return res.status(400).json({msg: "The email already exists"});

            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 characters"})
            
            // Password Encryption
            const passwordHash = await bcrypt.hash(password,10);
            const newRecruiter = new Recruiters({
                name, email, password:passwordHash
            })

            // Save in db
            await newRecruiter.save();
     
           // Create jsonWebToken to authenticate
           const accesstoken = createAccessToken({id: newRecruiter._id});
           const refreshtoken = createRefreshToken({id: newRecruiter._id});

           res.cookie('refreshtoken', refreshtoken, {
               httpOnly: true,
               path: '/recruiter/refresh_token',
           })

           res.json({accesstoken});

        } catch(err){
            return res.status(500).json({msg:err.message})
        }
    },

    login : async(req, res) =>{
        
        try{
            const {email, password} = req.body;

            const recruiter = await Recruiters.findOne({email})
            if(!recruiter)return res.status(400).json({msg:"Recruiter doesn't exist"})

            const isMatch = await bcrypt.compare(password, recruiter.password);
            if(!isMatch) return res.status(400).json({msg:"Incorrect password."})

            // if login success, create access token and refresh token
            const accesstoken = createAccessToken({id: recruiter._id});
            const refreshtoken = createRefreshToken({id: recruiter._id});

            res.cookie('refreshtoken', refreshtoken, {
               httpOnly: true,
               path: '/recruiter/refresh_token',
            })

            res.json({accesstoken});

        }catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    logout : async(req, res) =>{
        try{
            res.clearCookie('refreshtoken', {path: '/recruiter/refresh_token'});
  
            return res.json({msg:"Logged out"});
  
  
          } catch(err){
              return res.status(500).json({msg:err.msg})
          }
    },

    refreshToken: (req, res) =>{

        try{
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token)return res.status(400).json({msg:'Please Login or Register'})
            
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, recruiter) => {
                if(err) return res.status(400).json({ msg: "Please Login or register" });
                
                const accesstoken = createAccessToken({ id: recruiter.id });
        
                res.json({recruiter, accesstoken });
              });

        } catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    getRecruiter: async(req, res) => {

        try{  
            const recruiter = await Recruiters.findById(req.user.id).select('-password');
            // console.log(recruiter);
            if(!recruiter) return res.status(400).json({msg:"Recruiter doesn't exist"})
            
            res.json(recruiter);

        }catch(err){
            return res.status(500).json({msg:err.msg})
        }
    },

    createJob : async(req, res) => {
        try {

            const recruiter = await Recruiters.findById(req.user.id).select('-password');

            if(!recruiter) return res.status(400).json({msg:"Recruiter doesn't exist"})
            
            const {
              job_id,
              title,
              type,
              company,
              location,
              vacancies,
              status,
              content,
            } = req.body;

            // console.log(req.body);
      
            const newJob = new Jobs({
              job_id,
              recruiter_id: recruiter._id,
              title: title.toLowerCase(),
              type,
              company,
              location,
              vacancies,
              status,
              content,
            });
            
            // Save in DB
            await newJob.save();
            res.json({ msg: "Created a Job" });

          } catch (err) {
            return res.status(500).json({ msg: err.message });
          }
    },

    getJobDetails: async(req, res) => {
        try{
            const recruiter = await Recruiters.findById(req.user.id).select('-password');

            if(!recruiter) return res.status(400).json({msg:"Recruiter doesn't exist"})

            const jobs = await Jobs.find({recruiter_id: recruiter._id});

            let jobIds = [];

            jobs.forEach((job)=>{
                jobIds.push(job.job_id);
            })

            const jobDetails = await Applications.find({recruiter_id: recruiter._id,job_id: { $in: jobIds} })
            
            // console.log(jobDetails,"aaa");
            res.json({jobDetails});

        }catch(err){
            return res.status(500).json({ msg: err.message });
        }
        
    },

    acceptCandidate: async(req, res) =>{
        try{
            const recruiter = await Recruiters.findById(req.user.id).select('-password');
            if(!recruiter) return res.status(400).json({msg:"Recruiter doesn't exist"});

            const {job_id, candidate_id} = req.body;
            

            const applicationFilter = {job_id: job_id, candidate_id: candidate_id};
            const applicationUpdate = {status: "accept"}

            await Applications.findOneAndUpdate(applicationFilter, applicationUpdate, {
                new: true
            });


            // Decrementing Vacancies by 1
            const job = await Jobs.findOne({job_id:job_id});
            job.vacancies-=1;
            console.log(job.vacancies);
            


            if(job.vacancies===0){
                const jobFilter = {job_id:job_id};
                const jobUpdate = {status:"closed", vacancies: job.vacancies};
                await Jobs.findOneAndUpdate(jobFilter, jobUpdate, {
                    new: true
                });
            }

            else{
                const jobFilter = {job_id:job_id};
                const jobUpdate = {vacancies: job.vacancies};
                await Jobs.findOneAndUpdate(jobFilter, jobUpdate, {
                    new: true
                });
            }

            res.json({msg: "Candidate Accepted"});

        }catch(err){
            return res.status(500).json({ msg: err.message });
        }
    },

    rejectCandidate: async(req, res) =>{
        try{

            console.log("hi");
            const recruiter = await Recruiters.findById(req.user.id).select('-password');
            if(!recruiter) return res.status(400).json({msg:"Recruiter doesn't exist"});

            const {job_id, candidate_id} = req.body;

            const filter = {job_id: job_id, candidate_id: candidate_id};
            const update = {status: "reject"}

            await Applications.findOneAndUpdate(filter, update, {
                new: true
            });

            res.json({msg: "Candidate Rejected"});

        }catch(err){
            return res.status(500).json({ msg: err.message });
        }
    },

}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = recruiterCtrl;