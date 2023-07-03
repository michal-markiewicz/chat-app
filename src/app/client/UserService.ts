import axios from "axios";
import { IErrorMessage } from "../shared/contracts/Global";
import {
  IRegisterRequest,
  IUserServiceClient,
} from "../shared/contracts/IUserService";

class UserService implements IUserServiceClient {
  async register(request: IRegisterRequest): Promise<IErrorMessage> {
    const result = await axios.post("/api/user", request);
    return result.data;
  }
}

export default UserService;
