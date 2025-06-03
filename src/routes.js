const express = require('express')
const multer = require('multer')

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const DashboardController = require('./controllers/DashboardController')
const LoginController = require('./controllers/LoginController')
const uploadConfig = require('./config/upload')

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/status', (req, res) => {
  res.send({ status: 200 })
})

// TODO: SubscribeController
// TODO: ApprovalController
// TODO: RejectionContoller

//Login
routes.post('/login', LoginController.store)

// Dashboard
routes.get('/dashboard/:sport', DashboardController.getAllEvents)
routes.get('/dashboard', DashboardController.getAllEvents)
routes.get('/event/:eventId', DashboardController.getEventById)

// Event
routes.delete('/event/:eventId', EventController.deleteEvent)
// 1. req comes in
// 2. hits /event
// 3. middleware: completes upload.js logic on a single file
//  - grabs thumbnail file from headers, creates files folder, and saves file
// 4. passes thumbnail file to controller
routes.post('/event', upload.single("thumbnail"), EventController.createEvent)



// User
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

module.exports = routes;