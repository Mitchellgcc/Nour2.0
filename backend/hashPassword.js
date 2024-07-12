const bcrypt = require('bcrypt');
const { Client } = require('pg');

// Database connection configuration
const client = new Client({
  connectionString: 'postgres://mitchellgcc:Charlie123@localhost:5432/nutrition_app'
});

// Function to hash the password
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to update the user's password in the database
const updatePassword = async (email, newPassword) => {
  await client.connect();
  const res = await client.query(
    'UPDATE "Users" SET "password" = $1 WHERE "email" = $2',
    [newPassword, email]
  );
  await client.end();
  return res.rowCount;
};

// Main function to hash the password and update it in the database
const main = async () => {
  try {
    const email = 'mitchellgcc@gmail.com';
    const plainTextPassword = 'charlie123';
    const hashedPassword = await hashPassword(plainTextPassword);
    const result = await updatePassword(email, hashedPassword);

    if (result === 1) {
      console.log(`Password for ${email} has been updated successfully.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error('Error updating password:', error);
  }
};

main();
