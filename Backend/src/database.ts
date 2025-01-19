import { DataSource } from 'typeorm';
import { User } from './entity/User'; // Adjust the import based on your file structure
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a DataSource instance
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'mysql',  // Ensure type is correct
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User ], // Specify your entities here
  logging: false, // Set to true for logging SQL queries
  synchronize: true, // Auto-create tables in development
});

// Function to connect to the database
export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now TypeScript knows that 'error' is an instance of Error
      console.error('Database connection error:', error.message);
    } else {
      // In case the error is not an instance of Error, you can log it as is
      console.error('Unknown error occurred:', error);
    }
  }
};
