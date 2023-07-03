if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  throw new Error("This module should not be imported in the client");
}

export {};
