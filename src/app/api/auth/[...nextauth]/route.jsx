import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") {
    if (
      value === "[object Object]" ||
      value === "undefined" ||
      value === "null"
    )
      return "";
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
  if (
    !raw ||
    raw === "[object Object]" ||
    raw === "undefined" ||
    raw === "null"
  )
    return "";
  return raw;
}

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    // 🔐 EMAIL & PASSWORD LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      // async authorize(credentials) {
      //   // Fallback ensures it works locally even if env var is missing
      //   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      //   const res = await fetch(
      //     `${baseUrl}/auth/login`,
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(credentials),
      //     },
      //   );

      //   // SAFELY parse JSON to prevent the "<!DOCTYPE html>" crash
      //   const text = await res.text();
      //   let user = null;
      //   try {
      //     user = text ? JSON.parse(text) : null;
      //   } catch (error) {
      //     throw new Error(
      //       JSON.stringify({
      //         message: "Cannot reach the backend server. Please check your connection.",
      //       })
      //     );
      //   }

      //   if (!res.ok) {
      //     throw new Error(
      //       JSON.stringify({
      //         message: user?.message || "Login failed",
      //         lockUntil: user?.lockUntil || null,
      //       }),
      //     );
      //   }

      //   return {
      //     ...user,
      //     id: normalizeId(user?.id || user?._id),
      //   };
      // }

      async authorize(credentials) {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!baseUrl) {
          throw new Error(
            JSON.stringify({
              message: "Backend URL is not configured",
            }),
          );
        }

        const loginUrl = `${baseUrl}/auth/login`;

        try {
          const res = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const text = await res.text();

          console.log("Login URL:", loginUrl);
          console.log("Status:", res.status);
          console.log("Raw response:", text);

          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch {
            throw new Error(
              JSON.stringify({
                message: "Backend returned invalid JSON",
                status: res.status,
                response: text.slice(0, 500),
              }),
            );
          }

          if (!res.ok) {
            throw new Error(
              JSON.stringify({
                message: data?.message || "Login failed",
                status: res.status,
                lockUntil: data?.lockUntil || null,
              }),
            );
          }

          return {
            ...data,
            id: normalizeId(data?.id || data?._id),
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),

    // 🔵 GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // 🟣 GITHUB LOGIN
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // 🔹 Runs after OAuth login
    async signIn({ user, account }) {
      if (account.provider !== "credentials") {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        try {
          await fetch(`${baseUrl}/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
              role: "admin",
            }),
          });
        } catch (error) {
          console.error("Failed to sync OAuth user with backend:", error);
        }
      }
      user.id = normalizeId(user?.id || user?._id);
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = normalizeId(user?.id || user?._id);
        token.email = user.email;
      }
      if (!token.id) {
        token.id = normalizeId(token?.sub);
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = normalizeId(token?.id || token?.sub);
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
