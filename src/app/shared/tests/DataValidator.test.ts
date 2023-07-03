import DataValidator from "../helpers/DataValidator";

const dataValidator = new DataValidator();

describe("DataValidator", () => {
  describe("validateRegistrationData", () => {
    test("should return an error message if username is invalid", () => {
      const registrationData = {
        username: "John Doe",
        password: "123456",
      };
      const result = dataValidator.validateRegistrationData(
        registrationData.username,
        registrationData.password
      );
      expect(result.errorMsg).not.toBe("");
    });

    test("should return an error message if password is invalid", () => {
      const registrationData = {
        username: "JohnDoe",
        password: "1",
      };
      const result = dataValidator.validateRegistrationData(
        registrationData.username,
        registrationData.password
      );
      expect(result.errorMsg).not.toBe("");
    });

    test("should not return an error message if registration data is valid", () => {
      const registrationData = {
        username: "JohnDoe",
        password: "123456",
      };
      const result = dataValidator.validateRegistrationData(
        registrationData.username,
        registrationData.password
      );
      expect(result.errorMsg).toBe("");
    });
  });

  describe("validateUsername", () => {
    test("should return an error message if name is empty", () => {
      const result = dataValidator.validateUsername("");
      expect(result.errorMsg).toBe("Username is required.");
    });

    test("should return an error message if name contains spaces", () => {
      const result = dataValidator.validateUsername("John Doe");
      expect(result.errorMsg).toBe("Username cannot contain spaces.");
    });

    test("should return an error message if name is longer than 30 characters", () => {
      const result = dataValidator.validateUsername("a".repeat(31));
      expect(result.errorMsg).toBe(
        "Username must be at most 30 characters long."
      );
    });

    test("should not return an error message if name is valid", () => {
      const result = dataValidator.validateUsername("JohnDoe");
      expect(result.errorMsg).toBe("");
    });
  });

  describe("validatePassword", () => {
    test("should return an error message if password is empty", () => {
      const result = dataValidator.validatePassword("");
      expect(result.errorMsg).toBe("Password is required.");
    });
    test("should return an error message if password contains spaces", () => {
      const result = dataValidator.validatePassword("123 456");
      expect(result.errorMsg).toBe("Password cannot contain spaces.");
    });
    test("should return an error message if password is shorter than 6 characters", () => {
      const result = dataValidator.validatePassword("12345");
      expect(result.errorMsg).toBe(
        "Password must be at least 6 characters long."
      );
    });
    test("should return an error message if password is longer than 30 characters", () => {
      const result = dataValidator.validatePassword("a".repeat(31));
      expect(result.errorMsg).toBe(
        "Password must be at most 30 characters long."
      );
    });
    test("should not return an error message if password is valid", () => {
      const result = dataValidator.validatePassword("123456");
      expect(result.errorMsg).toBe("");
    });
  });
});
