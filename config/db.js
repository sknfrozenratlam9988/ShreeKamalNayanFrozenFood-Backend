import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Only log non-sensitive info — never log PG_PASSWORD or full credentials
console.log("PG_DATABASE =", process.env.PG_DATABASE);
console.log("PG_HOST =", process.env.PG_HOST);
console.log("PG_PORT =", process.env.PG_PORT);

if (!process.env.PG_DATABASE || !process.env.PG_USER || !process.env.PG_PASSWORD) {
  console.error("Missing required DB environment variables (PG_DATABASE, PG_USER, PG_PASSWORD)");
  process.exit(1);
}

export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || "127.0.0.1",
    port: Number(process.env.PG_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL connected: ${process.env.PG_DATABASE}@${process.env.PG_HOST}`);
  } catch (error) {
    console.error(`PostgreSQL connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;