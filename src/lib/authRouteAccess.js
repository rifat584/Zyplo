const privateRoutePrefixes = ["/dashboard"];

const guestOnlyRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function normalizePathname(pathname) {
  const normalizedPathname = String(pathname || "/").replace(/\/+$/, "");
  return normalizedPathname || "/";
}

function matchesPrivateRoute(pathname) {
  return privateRoutePrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function matchesGuestOnlyRoute(pathname) {
  return guestOnlyRoutes.includes(pathname);
}

function getAuthRedirectPath(pathname, isAuthenticated) {
  const normalizedPathname = normalizePathname(pathname);

  if (!isAuthenticated && matchesPrivateRoute(normalizedPathname)) {
    return "/login";
  }

  if (isAuthenticated && matchesGuestOnlyRoute(normalizedPathname)) {
    return "/dashboard";
  }

  return null;
}

module.exports = {
  getAuthRedirectPath,
};
