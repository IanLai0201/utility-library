export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      'then' in value &&
      typeof value.then === 'function' &&
      'catch' in value &&
      typeof value.catch === 'function')
  );
}
