import { createHmac } from "crypto";

function base64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signDashboardToken(user) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    id: String(user?.id || ""),
    email: String(user?.email || ""),
    name: String(user?.name || "User"),
    iat: now,
    exp: now + 60 * 60 * 8,
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${data}.${signature}`;
}

function normalizeUserId(value) {
  if (!value) return "";
  if (typeof value === "string") {
    if (value === "[object Object]" || value === "undefined" || value === "null") return "";
    return value;
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value.id === "string") return value.id;
    if (typeof value.toString === "function") {
      const out = value.toString();
      if (out && out !== "[object Object]") return out;
    }
  }
  const raw = String(value);
  if (!raw || raw === "[object Object]" || raw === "undefined" || raw === "null") return "";
  return raw;
}

function getBackendBaseUrl() {
  const raw = process.env.BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  return raw.replace(/\/+$/, "");
}

export async function proxyDashboard(path, { method = "GET", user, body } = {}) {
  const base = getBackendBaseUrl();
  if (!base) {
    return Response.json(
      {
        error:
          "Dashboard backend URL is missing. Set BASE_URL or NEXT_PUBLIC_BACKEND_URL in frontend env.",
      },
      { status: 500 }
    );
  }

  const normalizedUser = {
    ...user,
    id: normalizeUserId(user?.id || user?.sub),
  };

  const token = signDashboardToken(normalizedUser);
  if (!token) {
    return Response.json({ error: "NEXTAUTH_SECRET is missing for dashboard proxy auth" }, { status: 500 });
  }

  try {
    const target = `${base}${path}`;
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": normalizedUser.id,
        "x-user-email": String(normalizedUser?.email || ""),
        "x-user-name": String(normalizedUser?.name || "User"),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text ? { message: text } : null;
    }
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      {
        error: "Dashboard backend is unavailable",
        detail: String(error?.message || "Unknown fetch error"),
      },
      { status: 502 }
    );
  }
}
