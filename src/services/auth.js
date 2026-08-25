export async function adminLogin(email, password) {
  const response = await fetch("/api/auth/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Login failed."
    );
  }

  return data;
}

export async function getAdminSession() {
  const response = await fetch(
    "/api/auth/session",
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function adminLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
