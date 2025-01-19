import { DataSource } from 'typeorm';
import { User } from './entity/User';
import dotenv from 'dotenv';


dotenv.config();


export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'mysql', 
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User ], 
  logging: false, 
  synchronize: true, 
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
    
      console.error('Database connection error:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
};
