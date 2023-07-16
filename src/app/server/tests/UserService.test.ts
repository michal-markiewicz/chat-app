import mysql2 from "mysql2/promise";
import DatabaseService from "../helpers/DatabaseService";
import UserService from "../helpers/UserService";

const databaseService = new DatabaseService();
const userService = new UserService();

let connection: mysql2.Connection;

beforeAll(async () => {
  connection = await databaseService.connect();
  await connection.query(`
  INSERT INTO user (id, username, password) VALUES ('1', 'insertExisting', '123456');
  `);
  await connection.query(
    `  INSERT INTO user (id, username, password) VALUES ('2', 'get', '123456');`
  );
  await connection.query(
    `  INSERT INTO user (id, username, password) VALUES ('3', 'delete', '123456');`
  );
});

describe("UserService", () => {
  describe("register", () => {
    test("should save user in a database", async () => {
      const user = {
        username: "insert",
        password: "123456",
      };

      await userService.register(user);
      const result = await userService.getUser({ username: user.username });
      expect(result.username).toBe(user.username);
    });
    test("should return error when user already exists", async () => {
      const user = {
        username: "insertExisting",
        password: "123456",
      };

      await userService.register(user);
      const result = await userService.register(user);
      expect(result.errorMsg).toBe("User with this username already exists.");
    });
  });

  describe("getUser", () => {
    test("should get user by username", async () => {
      const username = "get";
      const result = await userService.getUser({ username });
      expect(result.username).toBe(username);
    });
  });

  describe("deleteUser", () => {
    test("should delete user", async () => {
      const username = "delete";
      await userService.deleteUser({ username });
      const result = await userService.getUser({ username });
      expect(result?.username).toBeFalsy();
    });
  });
});

afterAll(async () => {
  await connection.query(`DELETE FROM user`);
  await connection.end();
});
