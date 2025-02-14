import dotenv from "dotenv";
dotenv.config();

export default {
  userEmail: process.env.TEST_USER_EMAIL || "",
  userPassword: process.env.TEST_USER_PASSWORD || "",
  userUsedEmail: process.env.TEST_USER_USED_EMAIL || "",
  userAdmin2Email: process.env.TEST_ADMIN_EMAIL_2 || "",
  userAdmin2Password: process.env.TEST_ADMIN_WRONG_PASSWORD || "",
  userEmail2: process.env.TEST_USER_EMAIL_2 || "",
  userPassword2: process.env.TEST_USER_PASSWORD_2 || "",
  adminEmail: process.env.TEST_ADMIN_EMAIL || "",
  adminPassword: process.env.TEST_ADMIN_PASSWORD || "",
  userWrongEmail: process.env.TEST_USER_WRONG_EMAIL || "",
  userWrongPassword: process.env.TEST_USER_WRONG_PASSWORD || "",
  userNotVerified: process.env.TEST_USER_NOT_VERIFIED || "",
  userNewEmail: process.env.TEST_USER_NEW_EMAIL || "",
  userNewUserName: process.env.TEST_USER_NEW_USERNAME || "",
  userNewFirstName: process.env.TEST_USER_NEW_FIRSTNAME || "",
  userNewLastName: process.env.TEST_USER_NEW_LASTNAME || "",
};
