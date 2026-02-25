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
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          },
        );

        const user = await res.json();

        if (!res.ok) throw new Error(user.message);

        return {
          ...user,
          id: normalizeId(user?.id || user?._id),
        };
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
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth`, {
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
