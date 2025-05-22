/* eslint-disable no-undef */
import dotenv from 'dotenv';

dotenv.config({});

class Config {
  constructor() {
    this.POSTGRES_DB_URL = process.env.POSTGRES_DB_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SERVER_PORT = process.env.SERVER_PORT || 3000;
    this.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
  }
}

export const config = new Config();
