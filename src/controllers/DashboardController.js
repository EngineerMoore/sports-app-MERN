const Event = require('../models/Event');

module.exports = {
   async getEventById(req, res) {
    const { eventId } = req.params;

    try {
      const event = await Event.findById(eventId);
      return res.json(event)
    } catch (error) {
      
      return res.status(400).json({
        message:
          'Event does not exist. Would you like to create a new event?'
      })
    }
  },

  async getAllEvents(req, res) {
    const { sport } = req.params;
    // if no sport is listed, find({}) will return all events
      // produces routes: /dashboard/:sport & /dashboard/
    const query = { sport } || {}
    try {

      const events = await Event.find(query)
      return res.json(events);
    } catch (error) {
      return res.status(400).json({
        message: `No events found`
      })
    }
  }
}