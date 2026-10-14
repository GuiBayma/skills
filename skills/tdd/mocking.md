# When to mock

Mock only at the seams where the code meets what you do not control: external APIs (payment, email), time and randomness, and sometimes the file system or the database, where a local stand-in (a test database, an in-memory double) is preferred to a mock. Your own modules and internal collaborators are exercised for real, because a double of something you control tests the double, not the behaviour, and couples the test to the implementation.

## Shaping a seam for mocking

Two moves make a seam mockable; the `codebase-design` skill holds the reasoning behind the first.

**Take the dependencies that vary at the seam as parameters** rather than constructing them inside the module, so a test supplies its double through the interface instead of reaching past it:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**Prefer SDK-style interfaces over generic fetchers**: one function per external operation, so each mock returns one specific shape, test setup carries no conditional logic, a test shows which operations it exercises, and each operation is typed on its own:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch("/orders", { method: "POST", body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```
