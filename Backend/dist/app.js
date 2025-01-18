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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const sequelize_1 = require("sequelize");
const database_1 = require("./database"); // Assuming you are using AppDataSource for TypeORM
const User_1 = require("./entity/User");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = 9001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure your GitHub token is set in .env
// Sequelize instance for MySQL connection
const sequelize = new sequelize_1.Sequelize('mysql://root:ajishi@localhost:3306/github_friends');
// POST: Create or fetch a user from the database
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        // Check if the user already exists in the database
        let user = yield userRepository.findOne({ where: { username } });
        if (user) {
            // User already exists, return the existing data
            return res.status(200).json(user);
        }
        else {
            // User does not exist, call the GitHub API
            const response = yield axios_1.default.get(`${GITHUB_API_URL}/${username}`, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}` // Use the GitHub token for authenticated requests
                }
            });
            // Create a new User object to save in the database
            user = new User_1.User();
            user.username = response.data.login;
            user.name = (_a = response.data.name) !== null && _a !== void 0 ? _a : null;
            user.location = (_b = response.data.location) !== null && _b !== void 0 ? _b : null;
            user.blog = (_c = response.data.blog) !== null && _c !== void 0 ? _c : null;
            user.bio = (_d = response.data.bio) !== null && _d !== void 0 ? _d : null;
            user.followers = response.data.followers;
            user.following = response.data.following;
            user.public_repos = response.data.public_repos;
            user.public_gists = response.data.public_gists;
            user.company = (_e = response.data.company) !== null && _e !== void 0 ? _e : null;
            user.email = (_f = response.data.email) !== null && _f !== void 0 ? _f : null;
            user.hireable = (_g = response.data.hireable) !== null && _g !== void 0 ? _g : null;
            user.twitter_username = (_h = response.data.twitter_username) !== null && _h !== void 0 ? _h : null;
            // Save the user to the database
            yield userRepository.save(user);
        }
        // Return the user data
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}));
// Other routes...
// Start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test the database connection
        yield sequelize.authenticate();
        console.log('Database connection established successfully.');
        // Initialize AppDataSource for TypeORM (if used) or any other database setup you have
        yield database_1.AppDataSource.initialize(); // If using TypeORM
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
});
startServer();
