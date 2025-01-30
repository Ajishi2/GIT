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
<<<<<<< HEAD
const User_1 = require("./entity/User"); // Adjust the import based on your file structure
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create a DataSource instance
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE, // Ensure type is correct
=======
const User_1 = require("./entity/User"); 
const dotenv_1 = __importDefault(require("dotenv"));

dotenv_1.default.config();

exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE, 
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
<<<<<<< HEAD
    entities: [User_1.User], // Specify your entities here
    logging: false, // Set to true for logging SQL queries
    synchronize: true, // Auto-create tables in development
=======
    entities: [User_1.User], 
    logging: false, 
    synchronize: true, 
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
});

const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log('Database connection established successfully.');
    }
    catch (error) {
        if (error instanceof Error) {
<<<<<<< HEAD
            // Now TypeScript knows that 'error' is an instance of Error
            console.error('Database connection error:', error.message);
        }
        else {
            // In case the error is not an instance of Error, you can log it as is
=======
            
            console.error('Database connection error:', error.message);
        }
        else {
            
>>>>>>> 24510b2289bc057421d592636edc584bfa018e60
            console.error('Unknown error occurred:', error);
        }
    }
});
exports.connectDatabase = connectDatabase;
