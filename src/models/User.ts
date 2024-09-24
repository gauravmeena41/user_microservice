import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IUser } from "../interfaces/IUser";

// User Schema definition
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    isActive: { type: Boolean, default: true },
    isLocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerificationToken: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerificationExpires: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    twoFactorRecoveryCodes: [{ type: String }],
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH_SALT as string));
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

// Method to generate a password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour expiry
  return resetToken;
};

// Method to generate an email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 3600000; // 1 hour expiry
  return verificationToken;
};

// Method to generate a two-factor authentication secret
userSchema.methods.generateTwoFactorSecret = function () {
  const secret = crypto.randomBytes(20).toString("hex");
  this.twoFactorSecret = secret;
  return secret;
};

// Method to generate two-factor recovery codes
userSchema.methods.generateTwoFactorRecoveryCodes = function () {
  const codes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString("hex")
  );
  this.twoFactorRecoveryCodes = codes;
  return codes;
};

// Method to verify a two-factor authentication code
userSchema.methods.verifyTwoFactorCode = function (code: string) {
  return this.twoFactorSecret === code; // Simplified example, in practice use a more secure method
};

// Method to check if the account is locked
userSchema.methods.isAccountLocked = function () {
  return (
    this.isLocked ||
    (this.failedLoginAttempts >= 5 &&
      Date.now() - this.failedLoginAttempts * 1000 < 3600000)
  ); // Example logic for account lock
};

// Model creation
const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
