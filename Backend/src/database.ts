import { DataSource } from 'typeorm';
import { User } from './entity/User';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,  // Set to false to preserve existing data
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
    extra: {
        connectionLimit: 10,
        charset: 'utf8mb4',
        connectTimeout: 30000,
        acquireTimeout: 30000,
        timeout: 30000
    }
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
        process.exit(1);
    }
};
