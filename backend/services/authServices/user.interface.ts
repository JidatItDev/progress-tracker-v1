import { IUserPermissions } from "../../models/userModel";

export interface userData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  permissions?: IUserPermissions; 
}

export interface LoginData {
  email: string;
  password: string;
}
