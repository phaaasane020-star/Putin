import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "pe_admin";

const key = () => new TextEncoder().encode(process.env.SESSION_SECRET || "");

export async function createSession() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function verifySession(token) {
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}
