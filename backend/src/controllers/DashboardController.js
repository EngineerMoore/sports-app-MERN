const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// jwt.verify checks if the token and secret 

module.exports = {
  getEventById(req, res) {
    jwt.verify(req.token, 'secret', async(err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { eventId } = req.params;
        try {
          const event = await Event.findById(eventId);
          return res.json({ authData, event })
        } catch (error) {
          
          return res.status(400).json({
            message:
              'Event does not exist. Would you like to create a new event?'
          })
        }
      }
    })
  },

  getAllEvents(req, res) {
    jwt.verify(req.token, 'secret', async(err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { sport } = req.params;
        // if no sport is listed, find({}) will return all events
          // produces routes: /dashboard/:sport & /dashboard/
        const query = sport ? { sport } : {}

        try {

          const events = await Event.find(query)
          return res.json({ authData, events });
        } catch (error) {
          return res.status(400).json({
            message: `No events found`   
          })
        }
      }
    })
  },

  async getEventsByUserId(req, res) {
    jwt.verify(req.token, 'secret', async(err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        try {
            const events = await Event.find({ user: authData.user._id });
            return res.json({ authData, events});
          } catch (error) {
            return res.status(400).json({
              message: `No events found for user ${authData.user._id}`
            });
          }
        }
    });
  }
}