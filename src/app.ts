import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import roleRoutes from "./routes/roles";
import clientRoutes from "./routes/client";
import { connectToMongoDB } from "./Database/mongoDB";
import rateLimiter from "./utils/rateLimit";

dotenv.config();

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

declare module "express" {
  interface Request {
    validatedBody?: any;
  }
}

const app = express();
const csrfProtection = csurf({ cookie: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(helmet());

// Security headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-source.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}));
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' }));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.hidePoweredBy());
app.use(cookieParser());
app.use(rateLimiter);

// Force HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Adjust secure flag
      httpOnly: true,
      maxAge: 3600000,
    },
  })
);

// CSRF Protection
app.use(csrfProtection);

// Content-Disposition header for responses
app.use((req, res, next) => {
  res.setHeader('Content-Disposition', 'attachment');
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/client", clientRoutes);
app.get('/api/csrf-token', (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something broke!"); // Consider detailed error handling in production
});

// Start server
app.listen(process.env.SERVER_PORT, async () => {
  await connectToMongoDB();
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
});

export default app;