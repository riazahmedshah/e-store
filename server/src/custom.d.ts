import { IUser } from "./models/user.model.ts";

export type SafeUser = Omit<IUser, 'password'> 

declare global {
  namespace Express {
    interface Request {
      user:? SafeUser;
    }
  }
}