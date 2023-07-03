import mysql2 from "mysql2/promise";

export interface IDatabaseService {
  connect(): Promise<mysql2.Connection>;
}
