const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
  async createUser(req, res) {
    try {
      const {firstName, lastName, password, email} = req.body;

      const existentUser = await User.findOne({ email });
      
      if (!existentUser) {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          // if key = variable, key : value written as one. Ex. 'firstName: firstName' = 'firstName'
          // key/value order doesn't have to match db model
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
  
        return res.json({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })
      }

      res.status(400).json({
        message: 'Email already exists. Please log in'
      });
      
    } catch (error) {
      throw Error(`Registration Unsuccessful: ${error}`)
    }
  },

  async getUserById(req, res) {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      return res.send(user)
    } catch (error) {
      
      return res.status(400).json({
        message:
          'User ID does not exist, do you want to register instead?'
      })
    }
  }
}