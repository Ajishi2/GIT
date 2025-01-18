import { DataSource } from 'typeorm';
import { User } from './entity/User';
// Adjust the import based on your file structure

// Create a DataSource instance
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root', // Use 'root' as the username
  password: 'ajishi', // Replace with your MySQL password
  database: 'github_friends', // Replace with your database name
  entities: [User],
  logging: false, // Specify your entities here
  synchronize: true, // Set to true for development to auto-create tables
});

// Function to connect to the database
export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};