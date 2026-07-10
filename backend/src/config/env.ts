import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DB_URL",
  "JWT_SECRET",
  "JWT_ISSUER",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
});

export const config = {
  jwtSecret: process.env.JWT_SECRET as string,
  jwtIssuer: process.env.JWT_ISSUER as string,
  db: {
    connectionString: process.env.DB_URL as string,
  },
  port: Number(process.env.PORT),
};
