import { UserType } from "../models/User";
import { Document, FilterQuery } from "mongoose";
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
      file?: Multer.File;
      files?: { [fieldname: string]: Multer.File[] } | Multer.File[];
      filterObj?: FilterQuery<Document>;
    }
  }
}
