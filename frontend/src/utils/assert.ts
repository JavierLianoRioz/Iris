/**
 * Asserts that a condition is true. If not, throws an Error with the provided message.
 * Use this to enforceable invariants and fail fast.
 */
export function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
