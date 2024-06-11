const bcrypt = require('bcryptjs');

const plaintextPassword = 'Charlie123';
bcrypt.hash(plaintextPassword, 12, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
