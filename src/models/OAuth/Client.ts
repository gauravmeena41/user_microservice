import mongoose, { Model, Schema } from "mongoose";
import { IClient } from "../../interfaces/OAuth/IClient";

const oauthClientSchema = new Schema<IClient>(
  {
    clientId: { type: String, required: true, unique: true },
    clientSecret: { type: String, required: true },
    redirectUris: [{ type: String, required: true }],
    grants: [
      {
        type: String,
        enum: [
          "authorization_code",
          "password",
          "client_credentials",
          "refresh_token",
        ],
        required: true,
      },
    ],
    scopes: [{ type: String }],
    name: { type: String },
    description: { type: String },
    clientType: { type: String, enum: ["confidential", "public"] },
    logoUri: { type: String },
    policyUri: { type: String },
    tosUri: { type: String },
    authMethod: { type: String },
    tokenEndpointAuthMethod: { type: String },
    contacts: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
    publicKey: { type: String },
    clientJwt: { type: String },
    tokenExpiry: { type: Number },
    ipRestrictions: [{ type: String }],
    revoked: { type: Boolean, default: false },
    clientUri: { type: String },
    termsOfUse: { type: String },
    consentUri: { type: String },
  },
  { timestamps: true }
);

// Check if the model already exists, otherwise create it
const OAuthClient: Model<IClient> =
  mongoose.models.OAuthClient ||
  mongoose.model<IClient>("OAuthClient", oauthClientSchema);

export default OAuthClient;
