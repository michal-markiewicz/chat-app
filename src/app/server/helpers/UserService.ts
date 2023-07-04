import { IErrorMessage } from "@/app/shared/contracts/Global";
import { IDataValidator } from "@/app/shared/contracts/IDataValidator";
import { IDatabaseService } from "@/app/shared/contracts/IDatabaseService";
import { IHasher } from "@/app/shared/contracts/IHasher";
import {
  IDeleteUserRequest,
  IDeleteUserResult,
  IGetUserRequest,
  IGetUserResult,
  IRegisterRequest,
  IUserService,
} from "@/app/shared/contracts/IUserService";
import DataValidator from "@/app/shared/helpers/DataValidator";
import { RowDataPacket } from "mysql2";
import DatabaseService from "./DatabaseService";
import Hasher from "./Hasher";
import "./server-only";

class UserService implements IUserService {
  databaseService: IDatabaseService;
  dataValidator: IDataValidator;
  hasher: IHasher;
  constructor() {
    this.databaseService = new DatabaseService();
    this.dataValidator = new DataValidator();
    this.hasher = new Hasher();
  }

  async register(request: IRegisterRequest): Promise<IErrorMessage> {
    const { username, password } = request;

    const registrationDataValidation =
      this.dataValidator.validateRegistrationData(username, password);

    if (registrationDataValidation.errorMsg !== "") {
      return registrationDataValidation;
    }

    const existingUserByUsername = await this.getUser({ username });
    if (existingUserByUsername.username) {
      return {
        errorMsg: "User with this username already exists.",
      };
    }

    const hashedPassword = await this.hasher.hashPassword(password);
    const dbConnection = await this.databaseService.connect();

    await dbConnection.execute(
      "INSERT INTO user (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    await dbConnection.end();
    return { errorMsg: "" };
  }

  async getUser(request: IGetUserRequest): Promise<IGetUserResult> {
    const { username } = request;

    const dbConnection = await this.databaseService.connect();
    let rows: RowDataPacket[] = [];

    if (username) {
      const [result] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT username, password FROM user WHERE username = ?",
        [username]
      );
      rows.push(...result);
    }

    if (rows.length > 0) {
      const user = rows[0];
      return {
        username: user.username,
        password: user.password,
        errorMsg: "",
      };
    }

    await dbConnection.end();
    return {
      errorMsg: "User not found.",
    };
  }

  async deleteUser(request: IDeleteUserRequest): Promise<IDeleteUserResult> {
    const { username } = request;
    const dbConnection = await this.databaseService.connect();
    await dbConnection.execute("DELETE FROM user WHERE username = ?", [
      username,
    ]);
    await dbConnection.end();

    return {
      errorMsg: "",
    };
  }
}

export default UserService;
