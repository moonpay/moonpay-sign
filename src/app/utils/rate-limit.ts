export function rateLimit(options: { interval: number }) {
  const tokenCache = new Map();
  const { interval } = options;

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        const currentTime = Date.now();
        const oldTokenCount = tokenCount[0];
        const oldTimestamp = tokenCount[1] || currentTime;

        // Reset if outside interval
        const timeDiff = currentTime - oldTimestamp;
        if (timeDiff > interval) {
          tokenCount[0] = 1;
          tokenCount[1] = currentTime;
          tokenCache.set(token, tokenCount);
          return resolve();
        }

        // Reject if over limit
        if (oldTokenCount >= limit) {
          return reject(new Error('Rate limit exceeded'));
        }

        // Increment and save
        tokenCount[0] = oldTokenCount + 1;
        tokenCount[1] = oldTimestamp;
        tokenCache.set(token, tokenCount);

        return resolve();
      }),
  };
}
