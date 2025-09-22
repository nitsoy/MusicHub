import jwt, { SignOptions, JwtPayload as StdJwtPayload } from "jsonwebtoken";

const SECRET: jwt.Secret = process.env.JWT_SECRET ?? "musichub-secret";

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(
  payload: Record<string, unknown>,
  expiresIn: SignOptions["expiresIn"] = "2h"
): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(header?: string): JwtPayload | null {
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, "");
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
