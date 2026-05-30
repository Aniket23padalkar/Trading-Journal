import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DB_URL",
  "DB_URL_DEV",
  "JWT_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
});

export const config = {
  jwtSecret: process.env.JWT_SECRET as string,
  db: {
    connectionString: process.env.DB_URL_DEV as string,
  },
  port: Number(process.env.PORT),
};
