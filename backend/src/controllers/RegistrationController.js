const Registration = require('../models/Registration');

module.exports = {
  async create(req, res) {
    const { user_id } = req.headers;
    const { eventId } = req.params;
    const { date } = req.body;

    const registration = await Registration.create({
      user: user_id,
      event: eventId,
      date
    })
    
    // populate shows value details, select:'-key' hides property (password is excluded from response)
    await registration
      .populate(["event", {path:"user", select:'-password'}]);
      
    return res.json(registration)
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
  }
}