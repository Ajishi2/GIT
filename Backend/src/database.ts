import { DataSource } from 'typeorm';
<<<<<<< HEAD
import { User } from './entity/User'; // Adjust the import based on your file structure
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
=======
import { User } from './entity/User';
import dotenv from 'dotenv';


dotenv.config();

>>>>>>> 24510b2289bc057421d592636edc584bfa018e60

export const AppDataSource = new DataSource({
<<<<<<< HEAD
  type: process.env.DB_TYPE as 'mysql',  // Ensure type is correct
=======
  type: process.env.DB_TYPE as 'mysql', 
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
<<<<<<< HEAD
  entities: [User], // Specify your entities here
  logging: false, // Set to true for logging SQL queries
  synchronize: true, // Auto-create tables in development
=======
  entities: [User ], 
  logging: false, 
  synchronize: true, 
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
<<<<<<< HEAD
      // Now TypeScript knows that 'error' is an instance of Error
      console.error('Database connection error:', error.message);
    } else {
      // In case the error is not an instance of Error, you can log it as is
=======
    
      console.error('Database connection error:', error.message);
    } else {
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
      console.error('Unknown error occurred:', error);
    }
  }
};
