import { requireAdmin } from "../../../server/middleware/adminAuth.js";
import { jsonResponse } from "../../../server/lib/response.js";

export async function onRequestGet(context) {
  const result = await requireAdmin(
    context.request,
    context.env
  );

  if (!result.authenticated) {
    return result.response;
  }

  return jsonResponse({
    success: true,
    authenticated: true,
    user: {
      id: result.user.sub,
      email: result.user.email,
      role: result.user.role,
    },
  });
}
