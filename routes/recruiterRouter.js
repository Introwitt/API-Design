const router = require('express').Router();
// const candidateCtrl = require('../controllers/canddateCtrl');


router.get('/register', (req, res)=>{
    res.send("Register Page for Recruiter");
})

module.exports = router;