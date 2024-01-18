/**
 * 深度優先搜尋 Depth-First Search, DFS
 *
 * @param data
 * @param childField
 * @param predicate
 */
export function traverseDFS<T extends Record<string, any>>(
  data: T | T[],
  childField: keyof T,
  predicate: (value: T, level: number) => boolean
): T | null {
  const queue = Array.isArray(data) ? data : [data];

  /**
   * 遞迴尋找
   *
   * @param data
   * @param level
   */
  function traverse(data: T[], level = 0): T | null {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];

      if (predicate(item, level)) {
        return item;
      }

      if (Array.isArray(item[childField])) {
        const result = traverse(item[childField], level + 1);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  return traverse(queue);
}
