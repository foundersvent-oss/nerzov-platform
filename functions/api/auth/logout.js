import { jsonResponse } from "../../../server/lib/response.js";

export async function onRequestPost() {
  const cookie = [
    "nerzov_admin_session=",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0",
  ].join("; ");

  return jsonResponse(
    {
      success: true,
    },
    200,
    {
      "Set-Cookie": cookie,
    }
  );
}
