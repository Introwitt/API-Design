const router = require('express').Router();
const candidateCtrl = require('../controllers/candidateCtrl');


router.post('/signup', candidateCtrl.signup);

router.post('/login', candidateCtrl.login);

router.post('/logout', candidateCtrl.logout);

router.get('/getAppliedJobs', candidateCtrl.getAppliedJobs);


module.exports = router;