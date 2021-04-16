const router = require('express').Router();
const jobCtrl = require('../controllers/jobCtrl');

router.get('/', jobCtrl.getJobs);
