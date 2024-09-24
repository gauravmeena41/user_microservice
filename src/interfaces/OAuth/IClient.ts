import { Document } from "mongoose";

export interface IClient extends Document {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grants: string[];
  scopes?: string[];
  name?: string;
  description?: string;
  clientType?: "confidential" | "public";
  logoUri?: string;
  policyUri?: string;
  tosUri?: string;
  authMethod?: string;
  tokenEndpointAuthMethod?: string;
  contacts?: string[];
  metadata?: Record<string, any>;
  publicKey?: string;
  clientJwt?: string;
  tokenExpiry?: number;
  ipRestrictions?: string[];
  revoked?: boolean;
  clientUri?: string;
  termsOfUse?: string;
  consentUri?: string;
}
