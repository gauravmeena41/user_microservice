import { Document } from "mongoose";
import { IClient } from "./IClient";
import { IUser } from "../IUser";

export interface IAuthorizationCode extends Document {
    authorizationCode: string;
    clientId: IClient;
    userId: IUser;
    expires: Date;
    redirectUri: string;
    scope?: string[]; // Optional, OAuth 2.0 scopes
    codeChallenge?: string; // Optional, PKCE code challenge
    codeChallengeMethod?: "plain" | "S256"; // Optional, PKCE method
    issuedAt?: Date; // Optional, date when the code was issued
    state?: string; // Optional, state parameter for CSRF protection
    sessionId?: string; // Optional, session identifier
    clientName?: string; // Optional, client application name
    clientDescription?: string; // Optional, client application description
    codeVerifier?: string; // Optional, PKCE code verifier
  }