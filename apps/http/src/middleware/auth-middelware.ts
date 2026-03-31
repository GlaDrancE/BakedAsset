import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token-generation.ts";

type JwtPayloadWithUserId = {
  userId: string;
  [key: string]: unknown;
};

function isJwtPayloadWithUserId(value: unknown): value is JwtPayloadWithUserId {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof (value as { userId?: unknown }).userId === "string"
  );
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    if (!isJwtPayloadWithUserId(payload)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.auth = { userId: payload.userId };
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
