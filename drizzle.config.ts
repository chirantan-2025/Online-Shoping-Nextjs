import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env files
const envLocalPath = path.resolve(".env.local");
const envPath = path.resolve(".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Fallback: use direct connection string if env var is not set
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/onlineshop";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
