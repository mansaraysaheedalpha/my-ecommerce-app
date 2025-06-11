//backend/src/types/express/index.d.ts
import { IUser } from "../../models/UserModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export {};
