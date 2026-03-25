const test = require("node:test");
const assert = require("node:assert/strict");

const { getAuthRedirectPath } = require("../src/lib/authRouteAccess.js");

test("redirects unauthenticated users away from private dashboard routes", () => {
  assert.equal(getAuthRedirectPath("/dashboard", false), "/login");
  assert.equal(getAuthRedirectPath("/dashboard/workspaces", false), "/login");
});

test("redirects authenticated users away from guest-only auth routes", () => {
  assert.equal(getAuthRedirectPath("/login", true), "/dashboard");
  assert.equal(getAuthRedirectPath("/register", true), "/dashboard");
  assert.equal(getAuthRedirectPath("/forgot-password", true), "/dashboard");
  assert.equal(getAuthRedirectPath("/reset-password", true), "/dashboard");
});

test("does not redirect authenticated users from invite acceptance routes", () => {
  assert.equal(getAuthRedirectPath("/accept-invite/token-123", true), null);
});

test("does not redirect public routes", () => {
  assert.equal(getAuthRedirectPath("/", false), null);
  assert.equal(getAuthRedirectPath("/pricing", true), null);
});
