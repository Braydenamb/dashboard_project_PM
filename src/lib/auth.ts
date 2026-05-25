import bcrypt from "bcryptjs";
import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "dashboard_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;
const devAuthSecret = randomBytes(32).toString("hex");

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("AUTH_SECRET must be set in production.");
  }
  return secret ?? devAuthSecret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
}

function createToken(userId: number) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${userId}.${exp}`;
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

function verifyToken(token: string) {
  const [userIdRaw, expRaw, signature] = token.split(".");
  if (!userIdRaw || !expRaw || !signature) return null;

  const payload = `${userIdRaw}.${expRaw}`;
  const expectedSignature = signPayload(payload);
  const exp = Number(expRaw);
  const userId = Number(userIdRaw);

  if (!Number.isInteger(exp) || !Number.isInteger(userId)) return null;
  if (expectedSignature !== signature) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  return { userId };
}

export async function loginWithCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return null;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const verified = verifyToken(token);
  if (!verified) return null;

  return prisma.user.findUnique({
    where: { id: verified.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export function isAuthenticatedToken(token?: string) {
  if (!token) return false;
  return Boolean(verifyToken(token));
}
