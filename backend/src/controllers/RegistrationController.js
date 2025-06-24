const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');

module.exports = {
  create(req, res) {
    jwt.verify(req.token, 'secret', async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const user_id = authData.user._id;
        const { eventId } = req.params;
        
        const registration = await Registration.create({
          user: user_id,
          event: eventId,
        })
        
        // populate shows value details, select:'-key' hides property (password is excluded from response)
        await registration.populate(["event", {path:"user", select:'-password'}]);
        
        await registration.event.populate([{path: "user", select:"-password" }])

        registration.owner = registration.event.user._id;
        registration.eventTitle = registration.event.title;
        registration.eventPrice = registration.event.price;
        registration.eventDate = registration.event.date;
        registration.userEmail = registration.user.email;
        registration.save();

        

        const ownerSocket = req.connectedUsers[registration.event.user._id];

        if (ownerSocket) {
          req.io.to(ownerSocket).emit('registration_request', registration)
        }
          
        return res.json(registration)
      }
    })
  },

  async getRegistration(req, res) {
    const { registration_id } = req.params;

    try {
      const registration = await Registration.findById(registration_id)

      await registration
        .populate(["event", {path:"user", select:'-password'}]);

      return res.json(registration)
    } catch (error) {
      return res.status(400).json({
        message: 'Registration not found'
      })
    }
  },

  getMyRegistrations(req, res) {
    jwt.verify(req.token, 'secret', async (err, authData) => {
      if (err) {
        res.sendStatus(401)
      } else {
        try {
          const registrationArr = await Registration.find({ "owner" : authData.user._id })
          return res.json(registrationArr)
        } catch  (error) {
          res.status(400)
        }
      }
    })
  }
}