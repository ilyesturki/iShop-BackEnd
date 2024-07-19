import mongoose, { Schema, Document } from "mongoose";

export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  provider?: string;
  providerId?: string;
  image?: string;
  address?: {
    details?: string;
    governorate?: string;
    city?: string;
    postalCode?: string;
  };
  wishList?: mongoose.Types.ObjectId[];
  basketList?: mongoose.Types.ObjectId[];
  role: "user" | "admin";
  status: "active" | "inactive";
  signUpCode?: string;
  signUpCodeExpires?: Date;
  pwResetCode?: string;
  pwResetExpires?: Date;
  pwResetVerified?: boolean;
  pwUpdatedAt: Date;
}

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    password: {
      type: String,
      minlength: [8, "Too short password"],
    },
    provider: String,
    providerId: String,
    image: String,
    address: {
      details: String,
      governorate: String,
      city: String,
      postalCode: String,
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    basketList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    signUpCode: String,
    signUpCodeExpires: Date,
    pwResetCode: String,
    pwResetExpires: Date,
    pwResetVerified: Boolean,
    pwUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  // Image
  this.image = this.image || "https://via.placeholder.com/150";
  next();
});

const UserModel = mongoose.model<UserType>("user", userSchema);

export default UserModel;
