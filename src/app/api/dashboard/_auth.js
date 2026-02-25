import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") {
    if (value === "[object Object]" || value === "undefined" || value === "null") return "";
    return value;
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value._id === "string") return value._id;
    if (typeof value.id === "string") return value.id;
    if (typeof value.toString === "function") {
      const asText = value.toString();
      if (asText && asText !== "[object Object]") return asText;
    }
  }
  const raw = String(value);
  if (!raw || raw === "[object Object]" || raw === "undefined" || raw === "null") return "";
  return raw;
}

export async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  const user = {
    ...session?.user,
    id: normalizeId(session?.user?.id || session?.user?.sub),
  };

  if (!user?.id) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user };
}
