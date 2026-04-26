/* ============================================
   MIDDLEWARE: REQUIRE AUTH — Better Auth Session Check
   ============================================ */

import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

/**
 * Express middleware that checks for a valid Better Auth session.
 * Attaches user + session to req for downstream handlers.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized. Please login first." });
    }

    // Attach to request for downstream use
    (req as any).authUser = session.user;
    (req as any).authSession = session.session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed." });
  }
}
