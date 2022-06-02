const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('admin_user', 'root', 'chiemtao', {
  host: 'localhost',
  dialect: 'mysql'
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default connectDB;