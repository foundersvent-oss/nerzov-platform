import { verifyPassword } from "../../../server/lib/crypto.js";
import { createJwt } from "../../../server/lib/jwt.js";
import { getDatabase } from "../../../server/lib/d1Client.js";
import {
  jsonResponse,
  errorResponse,
} from "../../../server/lib/response.js";
import { findUserByEmail } from "../../../server/queries/users.js";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return errorResponse(
        "Email and password are required.",
        400
      );
    }

    if (!env.JWT_SECRET) {
      return errorResponse(
        "JWT_SECRET is not configured.",
        500
      );
    }

    const db = getDatabase(env);

    const user = await findUserByEmail(db, email);

    if (!user || user.role !== "admin") {
      return errorResponse(
        "Invalid email or password.",
        401
      );
    }

    const passwordValid = await verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordValid) {
      return errorResponse(
        "Invalid email or password.",
        401
      );
    }

    const token = await createJwt(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      86400
    );

    const cookie = [
      `nerzov_admin_session=${token}`,
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      "Path=/",
      "Max-Age=86400",
    ].join("; ");

    return jsonResponse(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      200,
      {
        "Set-Cookie": cookie,
      }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return errorResponse(
      "Internal server error.",
      500
    );
  }
}
