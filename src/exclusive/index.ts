import { isPromise } from '../shared/is-promise';

/**
 * 事件鎖，防止連續點擊
 *
 * @param func
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

    if (isPromise(result)) {
      result.finally(() => {
        lock = false;
      });
    } else {
      setTimeout(() => {
        lock = false;
      });
    }
  };
}
