// src/services/oauthService.ts
import OAuth2Server, { AuthorizationCode, Callback } from "oauth2-server";
import OAuthClient from "../models/OAuth/Client";
import OAuthToken from "../models/OAuth/Token";
import OAuthAuthorizationCode from "../models/OAuth/AuthorizationCode";
import { IClient } from "../interfaces/OAuth/IClient";
import { IUser } from "../interfaces/IUser";
import User from "../models/User";

// Define the OAuth2 server model
const oauth = new OAuth2Server({
  model: {
    // Get access token
    getAccessToken: async (accessToken: string) => {
      const token = await OAuthToken.findOne({ accessToken })
        .populate("clientId")
        .populate("userId");

      if (!token) return null;

      const client = token.clientId as IClient;
      const user = token.userId as IUser;

      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client: {
          id: client.clientId,
          grants: client.grants,
          redirectUris: client.redirectUris,
        },
        user: {
          id: user._id!.toString(),
        },
      };
    },

    // Get client
    getClient: async (clientId: string, clientSecret: string) => {
      const client = await OAuthClient.findById(clientId);

      if (!client) return null;

      return {
        id: client._id!.toString(),
        grants: client.grants,
        redirectUris: client.redirectUris,
      };
    },

    // Save token
    saveToken: async (token: any, client: any, user: any) => {
      const savedToken = await OAuthToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        clientId: client.id,
        userId: user.id,
      });

      return {
        accessToken: savedToken.accessToken,
        accessTokenExpiresAt: savedToken.accessTokenExpiresAt,
        refreshToken: savedToken.refreshToken,
        refreshTokenExpiresAt: savedToken.refreshTokenExpiresAt,
        scope: savedToken.scope,
        client: {
          id: savedToken.clientId.toString(),
          grants: client.grants,
          redirectUris: client.redirectUris,
        },
        user: {
          id: savedToken.userId.toString(),
        },
      };
    },

    // Get authorization code
    getAuthorizationCode: async (authorizationCode: string) => {
      const code = await OAuthAuthorizationCode.findOne({ authorizationCode })
        .populate("clientId")
        .populate("userId");

      if (!code) return null;

      const client = code.clientId as IClient;
      const user = code.userId as IUser;

      return {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expires,
        redirectUri: code.redirectUri,
        scope: code.scope,
        codeChallenge: code.codeChallenge,
        codeChallengeMethod: code.codeChallengeMethod,
        client: {
          id: client._id!.toString(),
          grants: client.grants,
          redirectUris: client.redirectUris,
        },
        user: {
          id: user._id!.toString(),
        },
      };
    },
    // Inside the model object in your oauthService
    getUser: async (userId: string) => {
      console.log(userId);
      const user = await User.findById(userId).select("-password"); // Exclude sensitive data

      if (!user) return null;

      return {
        id: user._id!.toString(),
        username: "",
        email: user.email,
        // Add any other fields you need
      };
    },

    // Save authorization code
    saveAuthorizationCode: async (code: any, client: any, user: any) => {
      const savedCode = await OAuthAuthorizationCode.create({
        authorizationCode: code.authorizationCode,
        expires: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        codeChallenge: code.codeChallenge,
        codeChallengeMethod: code.codeChallengeMethod,
        clientId: client.id,
        userId: user.id,
      });

      return {
        authorizationCode: savedCode.authorizationCode,
        expiresAt: savedCode.expires,
        redirectUri: savedCode.redirectUri,
        scope: savedCode.scope,
        codeChallenge: savedCode.codeChallenge,
        codeChallengeMethod: savedCode.codeChallengeMethod,
        client: {
          id: client.clientId,
          grants: client.grants,
          redirectUris: client.redirectUris,
        },
        user: {
          id: savedCode.userId.toString(),
        },
      };
    },
    // Revoke token
    revokeToken: async (token: any) => {
      await OAuthToken.deleteOne({ accessToken: token.accessToken });
      return true;
    },
    // Revoke authorization code
    revokeAuthorizationCode: async (
      code: AuthorizationCode,
      callback?: Callback<boolean>
    ) => {
      const result = await OAuthAuthorizationCode.deleteOne({
        authorizationCode: code.authorizationCode,
      });

      const success = result.deletedCount > 0;

      // If a callback is provided, call it with null for error and success for result
      if (callback) {
        callback(null, success);
      }

      return success; // Also return the result for promise-based handling
    },

    // Verify scope
    verifyScope: async (token: any, scope: string) => {
      // Verify if the provided scope is valid for the token
      return token.scope.includes(scope);
    },
  },

  accessTokenLifetime: 3600, // 1 hour
  allowBearerTokensInQueryString: true,
});

export default oauth;
