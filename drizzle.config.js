import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL é obrigatório. Configure no arquivo .env");
}

export default {
  schema: "./database/schema.js",
  out: "./database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
};
