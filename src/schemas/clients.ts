import { z } from "zod";

// Define a schema for validating the registration of a new OAuth client
const registerClientSchema = z.object({
  /**
   * Array of grant types the client is allowed to use.
   * Must be non-empty to ensure the client has at least one grant type.
   * Validates against known grant types.
   */
  grants: z
    .array(
      z.enum([
        "authorization_code",
        "password",
        "client_credentials",
        "refresh_token",
      ])
    )
    .nonempty(),

  /**
   * List of valid redirect URIs for the client.
   * Must be non-empty to ensure there are valid URIs for redirection.
   * Each URI must be a valid URL.
   */
  redirectUris: z.array(z.string().url()).nonempty(),

  /**
   * List of scopes the client is allowed to request.
   * Optional to allow flexibility in client registration.
   */
  scopes: z.array(z.string()).optional(),

  /**
   * Name of the client application.
   * Optional but recommended for identification purposes.
   */
  name: z.string().optional(),

  /**
   * Description of the client application.
   * Optional but can provide helpful context about the client.
   */
  description: z.string().optional(),

  /**
   * Type of client (confidential or public).
   * Must be provided to categorize the client appropriately.
   */
  clientType: z.enum(["confidential", "public"]),

  /**
   * URL of the client's logo.
   * Optional. Must be a valid URL if provided.
   */
  logoUri: z.string().url().optional(),

  /**
   * URL for the client's privacy policy.
   * Optional. Must be a valid URL if provided.
   */
  policyUri: z.string().url().optional(),

  /**
   * URL for the client's terms of service.
   * Optional. Must be a valid URL if provided.
   */
  tosUri: z.string().url().optional(),

  /**
   * Authentication method used by the client.
   * Optional for flexibility.
   */
  authMethod: z.string().optional(),

  /**
   * Method used for authenticating at the token endpoint.
   * Optional for flexibility.
   */
  tokenEndpointAuthMethod: z.string().optional(),

  /**
   * Array of contact emails for the client.
   * Optional. Validates each email format.
   */
  contacts: z.array(z.string().email()).optional(),

  /**
   * Metadata associated with the client.
   * Optional. Can be any structure, useful for additional client info.
   */
  metadata: z.record(z.string(), z.any()).optional(),

  /**
   * Public key for the client, if applicable.
   * Optional for flexibility.
   */
  publicKey: z.string().optional(),

  /**
   * JWT for the client, if applicable.
   * Optional for flexibility.
   */
  clientJwt: z.string().optional(),

  /**
   * Expiry time for tokens issued to this client.
   * Optional. Should be a number if provided, representing seconds.
   */
  tokenExpiry: z.number().optional(),

  /**
   * Array of IP addresses allowed for the client.
   * Optional. Validates each IP format.
   */
  ipRestrictions: z.array(z.string().ip()).optional(),

  /**
   * URL for the client homepage.
   * Optional. Must be a valid URL if provided.
   */
  clientUri: z.string().url().optional(),

  /**
   * Terms of use for the client.
   * Optional but can provide legal context.
   */
  termsOfUse: z.string().optional(),

  /**
   * URL for the client's consent page.
   * Optional. Must be a valid URL if provided.
   */
  consentUri: z.string().url().optional(),
});

// Define a schema for validating updates to an OAuth client
const updateClientSchema = z.object({
  /**
   * Array of grant types the client is allowed to use.
   * Optional to allow partial updates. Validates against known grant types.
   */
  grants: z
    .array(
      z.enum([
        "authorization_code",
        "password",
        "client_credentials",
        "refresh_token",
      ])
    )
    .optional(),

  /**
   * List of valid redirect URIs for the client.
   * Optional to allow partial updates. Each URI must be a valid URL.
   */
  redirectUris: z.array(z.string().url()).optional(),

  /**
   * List of scopes the client is allowed to request.
   * Optional to allow partial updates.
   */
  scopes: z.array(z.string()).optional(),

  /**
   * Name of the client application.
   * Optional to allow partial updates.
   */
  name: z.string().optional(),

  /**
   * Description of the client application.
   * Optional to allow partial updates.
   */
  description: z.string().optional(),

  /**
   * Type of client (confidential or public).
   * Optional to allow partial updates.
   */
  clientType: z.enum(["confidential", "public"]).optional(),

  /**
   * URL of the client's logo.
   * Optional to allow partial updates. Must be a valid URL if provided.
   */
  logoUri: z.string().url().optional(),

  /**
   * URL for the client's privacy policy.
   * Optional to allow partial updates. Must be a valid URL if provided.
   */
  policyUri: z.string().url().optional(),

  /**
   * URL for the client's terms of service.
   * Optional to allow partial updates. Must be a valid URL if provided.
   */
  tosUri: z.string().url().optional(),

  /**
   * Authentication method used by the client.
   * Optional to allow partial updates.
   */
  authMethod: z.string().optional(),

  /**
   * Method used for authenticating at the token endpoint.
   * Optional to allow partial updates.
   */
  tokenEndpointAuthMethod: z.string().optional(),

  /**
   * Array of contact emails for the client.
   * Optional to allow partial updates. Validates each email format.
   */
  contacts: z.array(z.string().email()).optional(),

  /**
   * Metadata associated with the client.
   * Optional to allow partial updates. Can be any structure.
   */
  metadata: z.record(z.string(), z.any()).optional(),

  /**
   * Public key for the client, if applicable.
   * Optional to allow partial updates.
   */
  publicKey: z.string().optional(),

  /**
   * JWT for the client, if applicable.
   * Optional to allow partial updates.
   */
  clientJwt: z.string().optional(),

  /**
   * Expiry time for tokens issued to this client.
   * Optional to allow partial updates. Should be a number if provided.
   */
  tokenExpiry: z.number().optional(),

  /**
   * Array of IP addresses allowed for the client.
   * Optional to allow partial updates. Validates each IP format.
   */
  ipRestrictions: z.array(z.string().ip()).optional(),

  /**
   * URL for the client homepage.
   * Optional to allow partial updates. Must be a valid URL if provided.
   */
  clientUri: z.string().url().optional(),

  /**
   * Terms of use for the client.
   * Optional to allow partial updates.
   */
  termsOfUse: z.string().optional(),

  /**
   * URL for the client's consent page.
   * Optional to allow partial updates. Must be a valid URL if provided.
   */
  consentUri: z.string().url().optional(),
});

export { registerClientSchema, updateClientSchema };
