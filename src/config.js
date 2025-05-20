import dotenv from 'dotenv';

dotenv.config({});

class Config {
  constructor() {
    this.POSTGRES_DB_URL = process.env.POSTGRES_DB_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SERVER_PORT = process.env.SERVER_PORT || 3000;
  }
}

export const config = new Config();