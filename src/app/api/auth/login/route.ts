import { type NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { db } from "@/lib/db/store";
import { DEFAULT_SUPER_ADMIN_PERMISSIONS } from "@/types/auth";
import { handleCorsPreflight, applyCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return applyCorsHeaders(
        NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 },
        ),
        req,
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if logging in with Super Admin env credentials (strictly read from .env)
    const envAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const envAdminPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();

    if (
      envAdminEmail &&
      envAdminPassword &&
      cleanEmail === envAdminEmail &&
      cleanPassword === envAdminPassword
    ) {
      let user = await db.getUserByEmail(cleanEmail);
      if (!user) {
        user = (await db.createUser({
          email: envAdminEmail,
          name: "Scalyx Admin",
          password: envAdminPassword,
          role: "super_admin",
          permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
        })) as any;
      }

      if (!user) {
        return applyCorsHeaders(
          NextResponse.json(
            { error: "Failed to authenticate admin" },
            { status: 500 },
          ),
          req,
        );
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "super_admin" as const,
        permissions: DEFAULT_SUPER_ADMIN_PERMISSIONS,
      };

      await setSessionCookie(sessionUser);
      return applyCorsHeaders(
        NextResponse.json({ success: true, user: sessionUser }),
        req,
      );
    }

    // Standard database user lookup
    const user = await db.getUserByEmail(cleanEmail);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        ),
        req,
      );
    }

    const isValid = await verifyPassword(cleanPassword, user.passwordHash);
    if (!isValid) {
      return applyCorsHeaders(
        NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        ),
        req,
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
    };

    await setSessionCookie(sessionUser);

    return applyCorsHeaders(
      NextResponse.json({ success: true, user: sessionUser }),
      req,
    );
  } catch (err: any) {
    return applyCorsHeaders(
      NextResponse.json(
        { error: err.message || "Login failed" },
        { status: 500 },
      ),
      req,
    );
  }
}
