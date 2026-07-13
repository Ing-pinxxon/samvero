import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "samvero_session";
const ALG = "HS256";

function getKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET no está configurado (mínimo 16 caracteres).");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  email: string;
  role: "admin";
};

/** Firma un JWT de sesión válido por 7 días. */
export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

/** Verifica el JWT y devuelve el payload o null si es inválido/expirado. */
export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey());
    if (payload.role !== "admin" || typeof payload.email !== "string") return null;
    return { email: payload.email, role: "admin" };
  } catch {
    return null;
  }
}
