import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../setupDatabase.js';
import {UserModel} from './userModel.js';

export const PaymentModel = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Amount is required' },
        isFloat: { msg: 'Amount must be a number' },
        min: { args: [0.01], msg: 'Amount must be greater than 0' },
      },
    },
    provider: {
      type: DataTypes.ENUM('stripe'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['stripe']],
          msg: 'Provider must be one of: stripe,',
        },
      },
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Session ID is required' },
        len: {
          args: [1, 255],
          msg: 'Session ID must be between 1 and 255 characters',
        },
      },
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Customer ID is required' },
        len: {
          args: [1, 255],
          msg: 'Customer ID must be between 1 and 255 characters',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'completed', 'failed']],
          msg: 'Status must be one of: pending, completed, failed',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

UserModel.hasMany(PaymentModel, { foreignKey: 'userId' });
PaymentModel.belongsTo(UserModel, { foreignKey: 'userId' });
