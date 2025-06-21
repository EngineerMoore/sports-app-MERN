const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
  createEvent(req, res) {
        jwt.verify(req.token, 'secret', async(err, authData) => {
          if (err) {
            res.statusCode(401);
          } else {
            const { title, description, price, sport, date } = req.body;
            // deconstructed variable must match received headers.
              // Ex. userId was undefined because userid was recieved in headers
            const { user_id } = req.headers;
            const { filename } = req.file;

            const user = await User.findById(authData.user._id);

            if (!user) { 
              return res.status(400).json({ message: 'User does not exist!' })
            }

            const event = await Event.create({
              title,
              description,
              sport,
              date,
              price: parseFloat(price),
              user,
              thumbnail: filename
            })

            return res.json(event);
          }
        })

  },

  async deleteEvent(req, res) {
    jwt.verify(req.token, 'secret', async(err) => {
      if (err) {
        res.statusCode(401);
      } else {
        const { eventId } = req.params;
        try {
          await Event.findByIdAndDelete(eventId)
          return res.status(204).send()
        } catch (error) {
          res.status(400).json({ message: 'No event with the provided ID'})
        }
      }
    })
  }
}