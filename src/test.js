import { withTimeout, retry } from "./utils/async.utils.js";

// Test 1: withTimeout
async function testTimeout() {
  try {
    const result = await withTimeout(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("Success!");
        }, 1000);
      }),
      3000
    );

    console.log("Timeout Test:", result);
  } catch (error) {
    console.log("Timeout Test Error:", error.message);
  }
}


// Test 2: retry
async function testRetry() {
  try {
    const result = await retry(
      async () => {
        console.log("Trying...");
        return "Success!";
      },
      {
        retries: 3,
        baseDelay: 500,
      }
    );

    console.log("Retry Test:", result);
  } catch (error) {
    console.log("Retry Test Error:", error.message);
  }
}

await testTimeout();
await testRetry();

import { getUser } from "./services/user.service.js";

try {
  const user = await getUser(999);

  console.log(user);
} catch (error) {
  console.log("Error Name:", error.name);
  console.log("Error Message:", error.message);
  console.log("Status Code:", error.statusCode);
}