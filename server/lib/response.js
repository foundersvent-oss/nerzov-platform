export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse(
    {
      success: false,
      error: message,
    },
    status
  );
}
