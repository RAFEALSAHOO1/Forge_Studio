const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  return { allowed: true };
}
