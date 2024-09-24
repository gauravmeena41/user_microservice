import mongoose, { Model, mongo, Schema } from "mongoose";
import { IAuthorizationCode } from "../../interfaces/OAuth/IAuthorizationCode";

const authorizationCodeSchema = new Schema<IAuthorizationCode>(
  {
    authorizationCode: { type: String, required: true, unique: true },
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "OAuthClient",
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    expires: { type: Date, required: true },
    redirectUri: { type: String, required: true },
    scope: [{ type: String }], // Optional, OAuth 2.0 scopes
    codeChallenge: { type: String }, // Optional, PKCE code challenge
    codeChallengeMethod: { type: String, enum: ["plain", "S256"] }, // Optional, PKCE method
    issuedAt: { type: Date }, // Optional, date when the code was issued
    state: { type: String }, // Optional, state parameter for CSRF protection
    sessionId: { type: String }, // Optional, session identifier
    clientName: { type: String }, // Optional, client application name
    clientDescription: { type: String }, // Optional, client application description
    codeVerifier: { type: String }, // Optional, PKCE code verifier
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists, otherwise create it
const AuthorizationCode: Model<IAuthorizationCode> =
  mongoose.models.AuthorizationCode ||
  mongoose.model<IAuthorizationCode>(
    "AuthorizationCode",
    authorizationCodeSchema
  );

export default AuthorizationCode;
