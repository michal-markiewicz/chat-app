import UserService from "../helpers/UserService";

const userService = new UserService();

const user = {
  username: "test",
  password: "123456",
};

describe("UserService", () => {
  describe("register", () => {
    test("should save user in a database", async () => {
      const user = {
        username: "registration_test",
        password: "123456",
      };
      await userService.register(user);
      const result = await userService.getUser({ username: user.username });

      expect(result.username).toBe(user.username);
      await userService.deleteUser({ username: user.username });
    });
    test("should return error when user already exists", async () => {
      await userService.register(user);
      const result = await userService.register(user);

      expect(result.errorMsg).toBe("User with this username already exists.");
      await userService.deleteUser({ username: user.username });
    });
  });

  describe("getUser", () => {
    test("should get user by username", async () => {
      const username = "get_test";
      const result = await userService.getUser({ username });
      expect(result.username).toBe(username);
    });
  });

  describe("deleteUser", () => {
    test("should delete user", async () => {
      await userService.register(user);
      await userService.deleteUser({ username: user.username });
      const result = await userService.getUser({ username: user.username });

      expect(result?.username).toBeFalsy();
    });
  });
});
