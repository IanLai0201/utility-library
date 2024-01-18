/**
 * 廣度優先搜尋 Breadth-First Search, BFS
 *
 * @param data
 * @param childField
 * @param predicate
 */
export function traverseBFS<T extends Record<string, any>>(
  data: T | T[],
  childField: keyof T,
  predicate: (value: T, level: number) => boolean
): T | null {
  const queue = Array.isArray(data) ? data : [data];

  let nextQueue: T[] = [];
  let level = 0;

  while (queue.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const item = queue.shift()!;

    if (predicate(item, level)) {
      return item;
    }

    if (Array.isArray(item[childField])) {
      nextQueue.push(...(item[childField] as T[]));
    }

    if (queue.length === 0) {
      level++;
      queue.push(...nextQueue);
      nextQueue = [];
    }
  }

  return null;
}
