import * as dotenv from 'dotenv';
dotenv.config()

const jwtSecret = process.env.JWT_SECRET;
export const jwtConfig = {
  secret: jwtSecret,
};
