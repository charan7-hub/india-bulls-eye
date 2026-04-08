const attempts: { timestamps: number[]; lockedUntil: number | null } = {
  timestamps: [],
  lockedUntil: null,
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minute
const LOCKOUT_MS = 120_000; // 2 minute lockout after exceeding

export function checkRateLimit(): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();

  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return { allowed: false, retryAfterMs: attempts.lockedUntil - now };
  }
  if (attempts.lockedUntil && now >= attempts.lockedUntil) {
    attempts.lockedUntil = null;
    attempts.timestamps = [];
  }

  // Remove old attempts outside the window
  attempts.timestamps = attempts.timestamps.filter(t => now - t < WINDOW_MS);

  if (attempts.timestamps.length >= MAX_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_MS;
    return { allowed: false, retryAfterMs: LOCKOUT_MS };
  }

  return { allowed: true };
}

export function recordAttempt() {
  attempts.timestamps.push(Date.now());
}
