const express = require('express');
const router = express.Router();

const report = require('../controllers/reportsController');

module.exports = router
    .get('/report/total-inventory', report.getTotalItems)
    .get('/report/total-purchases', report.getPurchaseReport)
    .get('/report/vendor-purchases', report.getPurchsedByVendorReport)