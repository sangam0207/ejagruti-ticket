import dotenv from "dotenv";
dotenv.config();

const ENV = {
  APP_ENV: process.env.APP_ENV,
  APP_PORT: process.env.APP_PORT,
  MONGO_URL: process.env.MONGO_URL,
  AWS_SENDER: process.env.AWS_SENDER,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
};

export { ENV };
