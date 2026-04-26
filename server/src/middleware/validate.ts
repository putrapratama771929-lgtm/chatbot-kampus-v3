/* ============================================
   MIDDLEWARE: VALIDATE — Zod Schema Validation
   ============================================ */

import type { Request, Response, NextFunction } from "express";
import { z, type ZodSchema } from "zod";

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((i) => i.message),
      });
    }
    req.body = result.data;
    next();
  };
}

// ── Common Schemas ──

export const chatMessageSchema = z.object({
  session_id: z.string().uuid("Invalid session ID format"),
  message: z.string().min(1, "Message is required").max(1000, "Message too long (max 1000 chars)"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid ID"),
});
