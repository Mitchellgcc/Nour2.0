const { sequelize, connectDB } = require('./config/db');
const models = require('./models');

const init = async () => {
  try {
    // Authenticate database connection
    await connectDB();
    console.log('Database connection has been established successfully.');

    // Initialize models and set up associations
    Object.values(models).forEach(model => {
      if (model.init) model.init(sequelize);
    });

    Object.values(models).forEach(model => {
      if (model.associate) model.associate(models);
    });

    // Sync database
    await sequelize.sync({ force: true }); // Warning: This will drop and re-create all tables
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
};

init();
