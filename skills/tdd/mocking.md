# When to mock

Mock only at the seams where the code leaves the process. Which double fits follows the dependency categories of the `codebase-design` skill: a **true external** dependency (Stripe, Twilio, time, randomness) takes a mock adapter at its port; a **remote but owned** service (your own microservice or internal API) takes an in-memory adapter at its port, so the test needs no network even though the service is yours; a **local-substitutable** dependency (a database, the file system) runs its local stand-in (a test database, an in-memory filesystem) inside the suite rather than a mock. Everything **in-process**, your own modules and internal collaborators, is exercised for real, because a double of code that runs in the same process tests the double, not the behaviour, and couples the test to the implementation.

## Shaping a seam for mocking

Two moves make a seam mockable; the `codebase-design` skill holds the reasoning behind the first.

**Take the dependencies that vary at the seam as parameters** rather than constructing them inside the module, so a test supplies its double through the interface instead of reaching past it:

```typescript
// GOOD
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// BAD
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**Prefer SDK-style interfaces over generic fetchers**: one function per external operation, so each mock returns one specific shape, test setup carries no conditional logic, a test shows which operations it exercises, and each operation is typed on its own:

```typescript
// GOOD
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch("/orders", { method: "POST", body: data }),
};

// BAD
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```
