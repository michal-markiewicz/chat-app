import { IErrorMessage } from "../contracts/Global";
import { IDataValidator } from "../contracts/IDataValidator";

export default class DataValidator implements IDataValidator {
  validateRegistrationData(username: string, password: string): IErrorMessage {
    const usernameValidation = this.validateUsername(username);
    if (usernameValidation.errorMsg) {
      return usernameValidation;
    }

    const passwordValidation = this.validatePassword(password);
    if (passwordValidation.errorMsg) {
      return passwordValidation;
    }

    return {
      errorMsg: "",
    };
  }
  validateUsername(username: string): IErrorMessage {
    if (!username) {
      return {
        errorMsg: "Username is required.",
      };
    }

    if (username.includes(" ")) {
      return {
        errorMsg: "Username cannot contain spaces.",
      };
    }

    if (username.length > 30) {
      return {
        errorMsg: "Username must be at most 30 characters long.",
      };
    }

    return {
      errorMsg: "",
    };
  }

  validatePassword(password: string): IErrorMessage {
    if (!password) {
      return {
        errorMsg: "Password is required.",
      };
    }

    if (password.includes(" ")) {
      return {
        errorMsg: "Password cannot contain spaces.",
      };
    }

    if (password.length < 6) {
      return {
        errorMsg: "Password must be at least 6 characters long.",
      };
    }

    if (password.length > 30) {
      return {
        errorMsg: "Password must be at most 30 characters long.",
      };
    }

    return {
      errorMsg: "",
    };
  }
}
