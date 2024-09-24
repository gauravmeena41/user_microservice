import mongoose, { Document } from "mongoose";
import { IUser } from "../IUser";
import { IClient } from "./IClient";

export interface IToken extends Document {
  accessToken: string; // The access token itself
  tokenType: string; // Usually "Bearer"
  accessTokenExpiresAt: Date; // Expiry date and time of the access token
  refreshToken?: string; // The refresh token, if applicable
  refreshTokenExpiresAt?: Date; // Expiry date and time of the refresh token
  scope?: string[]; // The scope of access granted by the token
  clientId: IClient; // The client for whom the token was issued
  userId: IUser; // The user to whom the token was issued
  issuedAt?: Date; // Date and time when the token was issued
  audience?: string; // The intended recipient of the token
  issuer?: string; // The entity that issued the token
  revoked?: boolean; // Indicates whether the token has been revoked
  metadata?: Record<string, any>; // Custom metadata related to the token
  authorizationCode?: string; // The authorization code associated with the token if relevant
  pkceCodeChallenge?: string; // For PKCE support, if applicable
  pkceCodeChallengeMethod?: "plain" | "S256"; // PKCE code challenge method, if applicable
  tokenUsage?: string; // Information on how the token is used or intended to be used
}
