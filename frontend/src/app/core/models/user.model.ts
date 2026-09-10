import { IAddress } from './address.model';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  addresses: IAddress[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUsersResponse {
  message: string;
  data: IUser[];
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

// Body of POST /user (signup) and POST /user/admin (admin creates admin)
// email is optional: accounts are identified by username
export interface ICreateUserData {
  name: string;
  password: string;
  gender: 'male' | 'female';
  email?: string;
}
