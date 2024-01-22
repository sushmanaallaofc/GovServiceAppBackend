const notificationController = require('../controllers/notificationController')

const router = require('express').Router()


// Notification Routes
router.post('/sendNotifications', notificationController.sendNotifications)
router.get('/getNotifications/:id', notificationController.getNotifications)
router.delete('/deleteNotification/:id', notificationController.deleteNotification)

module.exports = router