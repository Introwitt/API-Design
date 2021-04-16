const router = require('express').Router();
const candidateCtrl = require('../controllers/candidateCtrl');
const auth = require('../middleware/auth');


// Candidate Routes
router.post('/signup', candidateCtrl.signup);

router.post('/login', candidateCtrl.login);

router.post('/logout', candidateCtrl.logout);

router.get('/refresh_token', candidateCtrl.refreshToken);

router.get('/infor', auth, candidateCtrl.getCandidate);

router.get('/getAppliedJobs', auth, candidateCtrl.getAppliedJobs);

router.post('/apply', auth, candidateCtrl.apply)

router.post('/deleteJob', auth, candidateCtrl.deleteJob)


module.exports = router;