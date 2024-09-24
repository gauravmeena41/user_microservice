import express, { Request, Response } from "express";
import oauth from "../services/oauthService";
import {
  Request as OAuthRequest,
  Response as OAuthResponse,
} from "oauth2-server";
import OAuthClient from "../models/OAuth/Client";
import User from "../models/User";

const router = express.Router();

router.get("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // res.cookie("userId", user._id, { httpOnly: true, secure: true, maxAge: 3600000 });

    req.session.userId = String(user._id);

    const { client_id, redirect_uri, response_type, scope, state } = req.query;
    const authorizeUrl = `http://localhost:5002/api/auth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}`;

    res.redirect(authorizeUrl);
  } catch (error) {}
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    await User.create({
      email,
      password,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/authorize", async (req: Request, res: Response) => {
  try {
    // Extract query parameters from the request
    const { client_id, redirect_uri, response_type, scope } = req.query;
    const { userId } = req.session;

    // Step 1: Validate the client
    const client = await OAuthClient.findById(client_id );
    if (!client) {
      return res.status(400).json({ error: "Invalid client_id" });
    }

    // Step 2: Validate the redirect URI
    if (!client.redirectUris.includes(redirect_uri as string)) {
      return res.status(400).json({ error: "Invalid redirect_uri" });
    }

    // Step 3: Validate the response type
    if (response_type !== "code") {
      return res.status(400).json({ error: "Invalid response_type" });
    }

    // Step 4: Construct OAuthRequest and OAuthResponse correctly
    const oauthRequest = new OAuthRequest({
      method: req.method,
      query: req.query, // Pass all query parameters (client_id, redirect_uri, response_type, etc.)
      headers: req.headers, // Ensure the request headers are included
    });
    const oauthResponse = new OAuthResponse(res);

    // Step 5: Call the OAuth server authorize method
    const authorizationCode = await oauth.authorize(
      oauthRequest,
      oauthResponse,
      {
        authenticateHandler: {
          handle: async () => {
            const user = await User.findById(userId);

            if (!user) {
              throw new Error("Invalid user");
            }

            return user;
          },
        },
      }
    );

    // Step 6: Send the authorization code as response
    res.json(authorizationCode);
  } catch (err: any) {
    // Catch errors and send an appropriate response
    res.status(400).json({ error: err.message });
  }
});

router.post("/token", async (req: Request, res: Response) => {
  try {
    const oauthReq = new OAuthRequest(req);
    const oauthRes = new OAuthResponse(res);

    const token = await oauth.token(oauthReq, oauthRes);

    res.json(token);
  } catch (err: any) {
    res.status(400).json({ error: err });
  }
});

export default router;
