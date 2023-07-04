import { IErrorMessage } from "./Global";

export type IUserServiceClient = Pick<IUserService, "register">;

export interface IUserService {
  register(request: IRegisterRequest): Promise<IRegisterResult>;
  getUser(request: IGetUserRequest): Promise<IGetUserResult>;
  deleteUser(request: IDeleteUserRequest): Promise<IDeleteUserResult>;
}

export interface IRegisterRequest {
  username: string;
  password: string;
}

export interface IRegisterResult extends IErrorMessage {}

export interface IGetUserRequest {
  username?: string;
}

export interface IGetUserResult extends IUser, IErrorMessage {}

export interface IUser {
  username?: string;
  password?: string;
}

export interface IDeleteUserRequest extends IUser {}

export interface IDeleteUserResult extends IErrorMessage {}
