import Hasher from "../helpers/Hasher";

const hasher = new Hasher();

describe("Hasher", () => {
  describe("hashPassword", () => {
    it("should return a string", async () => {
      const hashedPassword = await hasher.hashPassword("password");
      expect(typeof hashedPassword).toEqual("string");
    });
    it("should hash the password", async () => {
      const hashedPassword = await hasher.hashPassword("password");
      expect(hashedPassword).not.toEqual("password");
    });
  });
  describe("comparePasswords", () => {
    it("should return true if the passwords match", async () => {
      const hashedPassword = await hasher.hashPassword("password");
      const result = await hasher.comparePasswords("password", hashedPassword);
      expect(result).toEqual(true);
    });
    it("should return false if the passwords do not match", async () => {
      const hashedPassword = await hasher.hashPassword("password");
      const result = await hasher.comparePasswords("password1", hashedPassword);
      expect(result).toEqual(false);
    });
  });
});
