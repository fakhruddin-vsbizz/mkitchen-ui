const express = require('express');
const controller = require('../controllers/donationController');
const router = express.Router();

exports.router = router
    .post('/donation', controller.createDonation)
    .get('/donation/all', controller.getAllDonation)