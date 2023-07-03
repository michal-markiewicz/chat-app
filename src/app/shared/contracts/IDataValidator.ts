import { IErrorMessage } from "./Global";

export interface IDataValidator {
  validateRegistrationData(username: string, password: string): IErrorMessage;
  validatePassword(password: string): IErrorMessage;
  validateUsername(username: string): IErrorMessage;
}
