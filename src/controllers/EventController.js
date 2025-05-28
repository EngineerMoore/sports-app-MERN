const Event = require('../models/Event');
const User = require('../models/User')

module.exports = {
  async createEvent(req, res) {
    const { title, description, price } = req.body;
    // deconstructed variable must match received headers.
      // Ex. userId was undefined because userid was recieved in headers
    const { user_id } = req.headers;
    const { filename } = req.file;

    const user = await User.findById(user_id);

    if (!user) { 
      return res.status(400).json({ message: 'User does not exist!' })
    }

    const event = await Event.create({
      title,
      description,
      price: parseFloat(price),
      user: user_id,
      thumbnail: filename
    })

    return res.json(event);
  },

  async getEventById(req, res) {
    const { eventId } = req.params;

    try {
      const event = await Event.findById(eventId);
      return res.json(event)
    } catch (error) {
      
      res.status(400).json({
        message:
          'Event does not exist. Would you like to create a new event?'
      })
    }
  }
}