import bcrypt from "bcrypt";
import { IHasher } from "../../shared/contracts/IHasher";

export default class Hasher implements IHasher {
  private readonly saltRounds: number = 10;

  public async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Something went wrong with password hashing.");
    }
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }
}
