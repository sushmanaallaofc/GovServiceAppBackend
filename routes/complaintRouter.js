const complaintsController = require('../controllers/complaintsController')

const router = require('express').Router()

// complaints routes
router.post('/registerComplaint', complaintsController.upload,complaintsController.registerComplaint)
router.get('/getAllComplaints', complaintsController.getAllComplaints)


module.exports = router