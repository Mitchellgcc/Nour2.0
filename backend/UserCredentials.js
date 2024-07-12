const User = require('./models/User');
const bcrypt = require('bcrypt');

async function verifyUserCredentials(email, password) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        console.log('User credentials are correct.');
      } else {
        console.log('Incorrect password.');
      }
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error verifying user credentials:', error);
  }
}

verifyUserCredentials('mitchellgcc@gmail.com', 'Charlie123');
