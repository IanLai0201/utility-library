/**
 * 事件鎖，防止連續點擊
 *
 * @param cb
 *
 * @example
 * ```ts
 * const onSubmit = exclusive(
 *   handleSubmit(async (values) => {
 *     await submit(values);
 *   })
 *  );
 * ```
 */
export function exclusive<T extends (...args: any[]) => any | Promise<any>>(func: T) {
  let lock = false;

  return (...args: Parameters<T>) => {
    if (lock) {
      console.warn('Disable consecutive and rapid repeated triggering of the function.');
      return;
    }

    lock = true;

    const result = func(...args);

    if (result instanceof Promise) {
      result.finally(() => {
        lock = false;
      });
    } else {
      lock = false;
    }
  };
}
