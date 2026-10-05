function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, ms);
  });

  return Promise.race([
    promise,
    timeout,
  ]);
}

async function retry(
  fn,
  { retries = 3, baseDelay = 500 } = {}
) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw lastError;
      }

      const delay = baseDelay * 2 ** attempt;

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}

export {
  withTimeout,
  retry,
};