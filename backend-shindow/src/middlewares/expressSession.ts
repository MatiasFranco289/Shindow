import session from "express-session";

// Declare the interface to let typescript know there will be a variable 'connectionId'
declare module "express-session" {
  interface SessionData {
    connectionId: string;
  }
}

/**
 * Setup for express-session
 *
 * @param secret - The secret that will be used by express-session
 */
const expressSessionMiddleware = (secret: string, sessionMaxAge: string) => {
  return session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(sessionMaxAge),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  });
};

export default expressSessionMiddleware;
