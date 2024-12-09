import dotenv from 'dotenv';
dotenv.config();

export default {
  userEmail: process.env.TEST_USER_EMAIL || '',
  userPassword: process.env.TEST_USER_PASSWORD || '',
  adminEmail: process.env.TEST_ADMIN_EMAIL || '',
  adminPassword: process.env.TEST_ADMIN_PASSWORD || '',
  userWrongEmail: process.env.TEST_USER_WRONG_EMAIL || '', 
  userWrongPassword: process.env.TEST_USER_WRONG_PASSWORD || '',
  userNotVerified: process.env.TEST_USER_NOT_VERIFIED || '',
};