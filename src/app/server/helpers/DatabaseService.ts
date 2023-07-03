import { IDatabaseService } from "@/app/shared/contracts/IDatabaseService";
import mysql2 from "mysql2/promise";
import "./server-only";

export default class DatabaseService implements IDatabaseService {
  async connect() {
    const result = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    return result;
  }
}
