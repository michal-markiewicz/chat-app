import DatabaseService from "../helpers/DatabaseService";

const databaseService = new DatabaseService();
describe("DatabaseService", () => {
  describe("connect", () => {
    test("should return something", async () => {
      const result = await databaseService.connect();
      expect(result).toBeTruthy();
    });
  });
});
