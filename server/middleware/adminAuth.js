import { verifyJwt } from "../lib/jwt.js";
import { errorResponse } from "../lib/response.js";

export async function requireAdmin(request, env) {
  const cookieHeader = request.headers.get("Cookie") || "";

  const match = cookieHeader.match(
    /(?:^|;\s*)nerzov_admin_session=([^;]+)/
  );

  if (!match) {
    return {
      authenticated: false,
      response: errorResponse("Unauthorized", 401),
    };
  }

  const token = match[1];

  const secret = env.JWT_SECRET;

  if (!secret) {
    return {
      authenticated: false,
      response: errorResponse(
        "JWT_SECRET is not configured.",
        500
      ),
    };
  }

  const payload = await verifyJwt(token, secret);

  if (!payload || payload.role !== "admin") {
    return {
      authenticated: false,
      response: errorResponse("Unauthorized", 401),
    };
  }

  return {
    authenticated: true,
    user: payload,
  };
}
