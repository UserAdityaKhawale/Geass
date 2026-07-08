import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // In a build environment, this might get evaluated if we try to access it.
      // But by using a lazy initializer, we ensure it's only called at runtime inside routes.
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export a Proxy that forwards calls to the lazily initialized Stripe instance
// to ensure zero refactoring is needed in the rest of the codebase.
export const stripe = new Proxy({} as Stripe, {
  get(target, prop, receiver) {
    const instance = getStripe();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

