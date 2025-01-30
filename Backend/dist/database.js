"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, // Changed to false to prevent auto-sync
    logging: true, // Enable logging to see SQL queries
    entities: [User_1.User],
    migrations: [],
    subscribers: [],
    extra: {
        connectionLimit: 10,
        charset: 'utf8mb4',
        // Disable strict mode
        sqlMode: 'NO_ENGINE_SUBSTITUTION'
    }
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log('Database connection established successfully.');
        // First, drop the existing table
        yield exports.AppDataSource.query('DROP TABLE IF EXISTS user');
        console.log('Dropped existing table');
        // Then create new table with correct schema
        yield exports.AppDataSource.synchronize(true);
        console.log('Created new table with updated schema');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Database connection error:', error.message);
        }
        else {
            console.error('Unknown error occurred:', error);
        }
        process.exit(1); // Exit if database connection fails
    }
});
exports.connectDatabase = connectDatabase;
