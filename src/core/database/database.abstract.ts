import { DataSource } from 'typeorm';

export abstract class Database {
  protected abstract connection: DataSource;
  async init() {
    try {
      await this.connection.initialize();
      console.log('Database connection established successfully!');
    } catch (error) {
      console.error('Database connection failed', error);
    }
  }
}
