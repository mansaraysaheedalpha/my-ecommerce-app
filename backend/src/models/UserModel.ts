//src/models/UserModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  matchPassword: (password: string) => Promise<boolean>;
  roles: string[];
  permissions?: string;
  lastAdminAccess?: Date;
  isVerified: boolean;
  refreshTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    passwordHash: {
      type: String,
      required: [true, "password is required"],
    },
    roles: {
      type: [String],
      enum: ["user", "editor", "admin", "superadmin"],
      default: ["user"],
    },
    permissions: [
      {
        type: String,
      },
    ],
    lastAdminAccess: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredPassowrd: string) {
  return bcrypt.compare(enteredPassowrd, this.passwordHash);
};

UserSchema.index({ roles: 1 });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ updated: -1 });

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
