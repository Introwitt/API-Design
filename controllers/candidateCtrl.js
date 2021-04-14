// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const candidateCtrl = {

    signup : async(req, res) =>{
        try{

            const {name, email, password} = req.body;
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "The email already exists"});

            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 characters"})
            
            // Password Encryption
            const passwordHash = await bcrypt.hash(password,10);
            const newUser = new Users({
                name, email, password:passwordHash
            })

            // Save in db
            await newUser.save();
     
           // Create jsonWebToken to authenticate
           const accesstoken = createAccessToken({id: newUser._id});
           const refreshtoken = createRefreshToken({id: newUser._id});

           res.cookie('refreshtoken', refreshtoken, {
               httpOnly: true,
               path: '/user/refresh_token',
           })

           res.json({accesstoken});



        } catch(err){
            return res.status(500).json({msg:err.message})
        }
    },

    login : async(req, res) =>{
        res.send("login page for Candidate");
    },

    logout : async(req, res) =>{
        res.send("logged out");
    },

    getAppliedJobs : async(req, res) =>{
        res.send("Details of all Applied Jobs");
    },

}

module.exports = candidateCtrl;