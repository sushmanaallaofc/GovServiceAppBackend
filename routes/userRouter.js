const userController = require('../controllers/userController')

const router = require('express').Router()

router.get('/getAllComplaints/:id', userController.getAllComplaints)
router.get('/getComplaintDetails/:id', userController.getComplaintDetails)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/getUserDetails/:id', userController.getUserDetails)
router.put('/updateUserProfile', userController.updateUserProfile)

module.exports = router