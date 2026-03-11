import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  buildDashboardAuthHeaders,
  getDashboardBackendBaseUrl,
} from "@/app/api/dashboard/_backend";

function settingsUrlFromState(requestUrl, state, status) {
  const safeState = String(state || "").trim();
  if (!safeState) return new URL("/dashboard/workspaces", requestUrl);
  const qs = status ? `?github=${encodeURIComponent(status)}` : "";
  return new URL(`/dashboard/w/${safeState}/settings${qs}`, requestUrl);
}

function isCancelledSetup(setup_action) {
  const raw = String(setup_action || "").trim().toLowerCase();
  return raw === "cancelled" || raw === "canceled" || raw === "cancel";
}

function htmlResponse({ title, message, status = 400, actionHref, actionText }) {
  const safeTitle = String(title || "GitHub connection");
  const safeMessage = String(message || "Something went wrong.");
  const href = actionHref ? String(actionHref) : "";
  const text = actionText ? String(actionText) : "";

  const body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial; margin:0; background:#0b1220; color:#e5e7eb;}
      .wrap{min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;}
      .card{max-width:520px; width:100%; background:#0f172a; border:1px solid rgba(255,255,255,.08); border-radius:16px; padding:18px;}
      h1{margin:0 0 8px; font-size:16px;}
      p{margin:0 0 14px; font-size:14px; color:#cbd5e1; line-height:1.4;}
      a{display:inline-block; padding:10px 12px; border-radius:10px; background:#4f46e5; color:white; text-decoration:none; font-weight:600; font-size:13px;}
      a.secondary{background:transparent; border:1px solid rgba(255,255,255,.16); margin-left:8px;}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>${safeTitle}</h1>
        <p>${safeMessage}</p>
        ${
          href
            ? `<a href="${href}">${text || "Continue"}</a><a class="secondary" href="/dashboard/workspaces">Workspaces</a>`
            : `<a href="/dashboard/workspaces">Workspaces</a>`
        }
      </div>
    </div>
  </body>
</html>`;

  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const installation_id = searchParams.get("installation_id");
  const state = searchParams.get("state");
  const setup_action = searchParams.get("setup_action") || "";

  // GitHub may redirect back to the Setup URL on cancel with `setup_action=cancelled` and no installation_id.
  if (!state) {
    return NextResponse.redirect(new URL("/dashboard/workspaces", request.url));
  }
  if (!installation_id) {
    if (isCancelledSetup(setup_action)) {
      return NextResponse.redirect(settingsUrlFromState(request.url, state, "cancelled"));
    }
    return NextResponse.redirect(settingsUrlFromState(request.url, state, "error"));
  }

  const base = getDashboardBackendBaseUrl();
  if (!base) {
    return htmlResponse({
      title: "Backend not configured",
      message: "Backend URL is missing. Set BASE_URL or NEXT_PUBLIC_BACKEND_URL.",
      status: 500,
    });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user || null;
  if (!user?.id) {
    return htmlResponse({
      title: "Sign in required",
      message: "Please sign in to connect GitHub to this workspace.",
      status: 401,
      // After login we must return to this callback URL so we can forward the request to the backend.
      actionHref: `/login?callbackUrl=${encodeURIComponent(request.url)}`,
      actionText: "Sign in",
    });
  }

  const authHeaders = buildDashboardAuthHeaders(user);
  if (!authHeaders) {
    return htmlResponse({
      title: "Auth not configured",
      message: "Server authentication is not configured correctly.",
      status: 500,
    });
  }

  const qs = new URLSearchParams({
    installation_id,
    state,
  });
  if (setup_action) qs.set("setup_action", setup_action);

  const backendUrl = `${base}/github/callback?${qs.toString()}`;
  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      ...authHeaders,
    },
    redirect: "manual",
    cache: "no-store",
  });

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (location) {
      // Backend currently redirects to `${FRONTEND_URL}/dashboard?github=connected`.
      // We keep the same success signal but land the user back on workspace settings.
      try {
        const loc = new URL(location, request.url);
        const githubParam = String(loc.searchParams.get("github") || "").trim();
        if (loc.pathname === "/dashboard" && (githubParam === "connected" || githubParam === "error")) {
          return NextResponse.redirect(settingsUrlFromState(request.url, state, githubParam));
        }
      } catch {
        // ignore and fall back to the raw location
      }
      return NextResponse.redirect(location);
    }
    return NextResponse.redirect(settingsUrlFromState(request.url, state, "error"));
  }

  if (res.status === 401) {
    return htmlResponse({
      title: "Sign in required",
      message: "Please sign in to connect GitHub to this workspace.",
      status: 401,
      // After login we must return to this callback URL so we can forward the request to the backend.
      actionHref: `/login?callbackUrl=${encodeURIComponent(request.url)}`,
      actionText: "Sign in",
    });
  }

  if (res.status === 403) {
    return htmlResponse({
      title: "Admin only",
      message: "Only workspace admins can connect GitHub.",
      status: 403,
      actionHref: "/dashboard/workspaces",
      actionText: "Back to workspaces",
    });
  }

  if (!res.ok) {
    return htmlResponse({
      title: "GitHub connection failed",
      message: "Could not complete GitHub connection. Please try again.",
      status: 500,
    });
  }

  return NextResponse.redirect(settingsUrlFromState(request.url, state, "connected"));
}
