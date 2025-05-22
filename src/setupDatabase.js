import { Sequelize } from 'sequelize';
import { config } from './config.js';

const sequelize = new Sequelize(config.POSTGRES_DB_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

export const databaseConnection = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync();
    console.log('Postgres database connection has been established successfully.');
  } catch (error) {
    console.log('error', 'databaseConnection() method error:', error);
  }
};
