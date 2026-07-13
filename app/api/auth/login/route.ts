import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, createSession } from "@/lib/auth";

function validPassword(input: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && hash.length > 0) {
    return bcrypt.compareSync(input, hash);
  }
  const plain = process.env.ADMIN_PASSWORD;
  return !!plain && input === plain;
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Correo y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  if (email !== adminEmail || !validPassword(password)) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  const token = await createSession({ email: adminEmail, role: "admin" });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  return response;
}
