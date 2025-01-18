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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
// Adjust the import based on your file structure
// Create a DataSource instance
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // Use 'root' as the username
    password: 'ajishi', // Replace with your MySQL password
    database: 'github_friends', // Replace with your database name
    entities: [User_1.User],
    logging: false, // Specify your entities here
    synchronize: true, // Set to true for development to auto-create tables
});
// Function to connect to the database
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log('Database connection established successfully.');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
});
exports.connectDatabase = connectDatabase;
