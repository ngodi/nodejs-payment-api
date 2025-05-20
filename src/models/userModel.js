import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../setupDatabase.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Name is required' },
      notEmpty: { msg: 'Name cannot be empty' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Email must be unique' },
    validate: {
      notNull: { msg: 'Email is required' },
      isEmail: { msg: 'Email must be valid' },
    },
  },
}, {
  timestamps: true,
});

module.exports = User;
