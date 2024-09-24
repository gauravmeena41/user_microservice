import mongoose, { Document, Model, Schema } from "mongoose";
import { IToken } from "../../interfaces/OAuth/IToken";

// Define the token schema
const tokenSchema = new Schema<IToken>({
  accessToken: { type: String, required: true, unique: true },
  tokenType: { type: String, default: "Bearer" },
  accessTokenExpiresAt: { type: Date, required: true },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  scope: [{ type: String }],
  clientId: { type: Schema.Types.ObjectId, ref: "OAuthClient", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  issuedAt: { type: Date },
  audience: { type: String },
  issuer: { type: String },
  revoked: { type: Boolean, default: false },
  metadata: { type: Schema.Types.Mixed },
  authorizationCode: { type: String },
  pkceCodeChallenge: { type: String },
  pkceCodeChallengeMethod: { type: String, enum: ["plain", "S256"] },
  tokenUsage: { type: String },
});

// Check if the model already exists, otherwise create it
const Token: Model<IToken> =
  mongoose.models.Token || mongoose.model<IToken>("Token", tokenSchema);

export default Token;
