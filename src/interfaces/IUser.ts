import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  roles: mongoose.Types.ObjectId[];
  isActive: boolean;
  isLocked: boolean;
  lastLogin: Date | null;
  failedLoginAttempts: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  emailVerificationExpires?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorRecoveryCodes?: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  generateTwoFactorSecret(): string;
  verifyTwoFactorCode(code: string): boolean;
  generateTwoFactorRecoveryCodes(): string[];
}
