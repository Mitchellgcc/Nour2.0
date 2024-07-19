const bcrypt = require('bcryptjs');

const plaintextPassword = 'Charlie123';
const storedHash = '$2a$12$N8IfsBr6csuWuhuqV0urwurRkzMiz2F4d.xqxaGlso0h1fw2kVkb2';

bcrypt.compare(plaintextPassword, storedHash, (err, result) => {
  if (err) throw err;
  console.log('Password match result:', result);
});
