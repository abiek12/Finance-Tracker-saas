import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRegData } from '../types/user.types';
import fs from 'fs';
import logger from './logger.utils';
dotenv.config();

const SALT_ROUND = 10;
const salt = bcrypt.genSaltSync(SALT_ROUND);

// HTTP Status Codes
export const INTERNAL_ERROR = 500;
export const SERVICE_UNAVAILABLE = 503;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const SUCCESS = 200;
export const CREATED = 201;

// HTTP Status Messages
export const INTERNAL_ERORR_MSG = 'Internal Server Erorr';
export const BAD_REQUEST_MSG = 'Bad Request';
export const NOT_FOUND_MSG= 'Not Found';
export const UNAUTHORIZED_MSG = 'Unautherised';
export const SUCCESS_MSG = 'Ok';
export const CREATED_MSG = 'Created';

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
}

// Compare Password
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);    
}

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';

// Generate Access Token
export const generateAccessToken = async (userId: string): Promise<string> => {    
    return jwt.sign({ userId }, TOKEN_SECRET , { expiresIn: '1h' });
}

// Generate Refresh Token
export const generateRefreshToken = async (userId: string): Promise<string> => {
    return jwt.sign({ userId }, TOKEN_SECRET);
}

// Validate Email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Phone Number
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Validate Password at least 6 characters long with atleast one number and special character
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=]{6,}$/;
    return passwordRegex.test(password);
}

// Create token with id
export const createUniqueToken = async (id: string): Promise<string> => {
    return jwt.sign({ id }, TOKEN_SECRET);
}

// Generate Random User Name
export const generateRandomUserName = async (userData: UserRegData): Promise<string> => {
    return `${userData.email.split('@')[0]}_${Math.floor(Math.random() * 10000) + 1}`;
}

// Create upload directory
export const createUploadDirectory = (directory: string): void => {
    if (!fs.existsSync(directory)) {
        logger.info(`Creating upload directory... ${directory}`);
        const res = fs.mkdirSync(directory, { recursive: true });
        if(res === undefined) {
            logger.error(`Error creating upload directory: ${directory}`);
            return;
        }
        logger.info(`Upload directory created successfully.`);
    }
}