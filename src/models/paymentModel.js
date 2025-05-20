import { DataTypes }from 'sequelize';
import { v4 as uuidv4 }from 'uuid';
import { sequelize } from '../setupDatabase.js';
import User from './userModel.js'; 

const Payment = sequelize.define('Payment', {
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
}, {
  timestamps: true,
});

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Payment;
