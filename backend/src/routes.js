const express = require('express')
const multer = require('multer')
const verifyToken = require('./config/verifyToken');

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const DashboardController = require('./controllers/DashboardController')
const LoginController = require('./controllers/LoginController')
const RegistrationContoller = require('./controllers/RegistrationController')
const ApprovalContoller = require('./controllers/ApprovalController')
const RejectionContoller = require('./controllers/RejectionController')
const uploadConfig = require('./config/upload')

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/status', (req, res) => {
  res.send({ status: 200 })
})

// TODO: SubscribeController

// TODO: get registration by ID (registrationController)
// TODO: registration ApprovalController
// TODO: registration RejectionContoller

// Registration
routes.post('/registration/:eventId', verifyToken, RegistrationContoller.create)
routes.post('/registration/:registration_id/approvals', verifyToken, ApprovalContoller.approval)
routes.post('/registration/:registration_id/rejections', verifyToken, RejectionContoller.rejection)
routes.get('/registration/:registration_id', RegistrationContoller.getRegistration)

//Login
routes.post('/login', LoginController.store)

// Dashboard
routes.get('/dashboard/:sport', verifyToken, DashboardController.getAllEvents)
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents)
routes.get('/user/events', verifyToken, DashboardController.getEventsByUserId)
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById)

// Event
routes.delete('/event/:eventId', verifyToken, EventController.deleteEvent)
// 1. req comes in
// 2. hits /event
// 3. middleware: completes upload.js logic on a single file
//  - grabs thumbnail file from headers, creates files folder, and saves file
// 4. passes thumbnail file to controller
routes.post('/event', verifyToken, upload.single("thumbnail"), EventController.createEvent)



// User
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

module.exports = routes;