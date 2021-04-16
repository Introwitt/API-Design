const router = require('express').Router();
const recruiterCtrl = require('../controllers/recruiterCtrl');
const auth = require('../middleware/auth');

// Recruiter Routes

router.post('/signup', recruiterCtrl.signup);

router.post('/login', recruiterCtrl.login);

router.post('/logout', recruiterCtrl.logout);

router.get('/refresh_token', recruiterCtrl.refreshToken);

router.get('/infor', auth, recruiterCtrl.getRecruiter);

router.post('/createJob', auth, recruiterCtrl.createJob);

router.get('/getJobDetails', auth, recruiterCtrl.getJobDetails);

router.post('/acceptCandidate', auth, recruiterCtrl.acceptCandidate);

router.post('/rejectCandidate', auth, recruiterCtrl.rejectCandidate);


module.exports = router;