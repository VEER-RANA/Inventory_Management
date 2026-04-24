import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/products", "/add", "/movements", "/alerts"];
interface RequestLog {
  timestamp: string;
  path: string;
  method: string;
}

const requestLogs: RequestLog[] = [];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toISOString();

  requestLogs.push({ timestamp, path: pathname, method: request.method });
  if (requestLogs.length > 1000) {
    requestLogs.shift();
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[${timestamp}] ${request.method} ${pathname}`);
  }

  if (isProtectedRoute(pathname)) {
    const inventoryToken = request.cookies.get("inventory_token")?.value;
    if (!inventoryToken) {
      return NextResponse.redirect(new URL("/?error=access_denied", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Warehouse-Request", "true");
  return response;
}

export const config = {
  matcher: ["/products/:path*", "/add/:path*", "/movements/:path*", "/alerts/:path*"],
};

export function getRequestLogs(limit: number = 100): RequestLog[] {
  return requestLogs.slice(-limit);
}

export function filterRequestLogs(criteria: {
  path?: string;
  method?: string;
  minutesAgo?: number;
}): RequestLog[] {
  let filtered = [...requestLogs];

  if (criteria.path) {
    filtered = filtered.filter((log) => log.path.includes(criteria.path as string));
  }

  if (criteria.method) {
    filtered = filtered.filter((log) => log.method === criteria.method);
  }

  if (criteria.minutesAgo) {
    const cutoff = Date.now() - criteria.minutesAgo * 60 * 1000;
    filtered = filtered.filter((log) => new Date(log.timestamp).getTime() > cutoff);
  }

  return filtered;
}