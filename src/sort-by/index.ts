import { get } from 'lodash-es';

/**
 * 排序升冪/降冪
 */
export enum SortOrder {
  /**
   * 升冪
   */
  Asc,

  /**
   * 降冪
   */
  Desc,
}

/**
 * 排序條件
 */
export type Sort<T = any> = {
  /**
   * 條件欄位，支持 Object path
   *
   * 參考 lodash.get 取值
   */
  sort: string;

  /**
   * 排序方法
   *
   * Asc 或 Desc，陣列做排序參考，或自定義排序 Function
   */
  order: SortOrder | T[] | ((valueA: T, valueB: T) => number);
};

function compareString(a: string, b: string): number {
  return String(a).localeCompare(String(b));
}
function compareNumber(a: number, b: number): number {
  return a - b;
}
function compareDate(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}
function compareBoolean(a: boolean, b: boolean): number {
  return a === b ? 0 : a ? 1 : -1;
}

/**
 * 比對
 *
 * @param a
 * @param b
 * @returns
 */
function compareValue(a: any, b: any): number {
  if (typeof a === 'string' || typeof b === 'string') {
    return compareString(a, b);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return compareNumber(a, b);
  }

  if (a instanceof Date && b instanceof Date) {
    return compareDate(a, b);
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return compareBoolean(a, b);
  }

  warn(
    `field value is not handled by a defined type handler. get A value is ${a}, B value is ${b}.`
  );

  return a - b;
}

/**
 * 依據參考做比對
 *
 * @param a
 * @param b
 * @param reference
 * @returns
 */
function compareValueByReference(a: any, b: any, reference: any[]): number {
  const indexOfA = reference.includes(a) ? reference.indexOf(a) : Infinity;
  const indexOfB = reference.includes(b) ? reference.indexOf(b) : Infinity;

  if (indexOfA > indexOfB) {
    return 1;
  } else if (indexOfA < indexOfB) {
    return -1;
  }
  return 0;
}

/**
 * 建立排序 function
 *
 * @param sort
 * @returns
 */
function compareFactory({ sort, order }: Sort) {
  return (a: any, b: any) => {
    const valueA = get(a, sort);
    const valueB = get(b, sort);

    let result: number;

    // asc
    if (order === SortOrder.Asc) {
      result = compareValue(valueA, valueB);
    }

    // desc
    else if (order === SortOrder.Desc) {
      result = compareValue(valueB, valueA);
    }

    // reference array
    else if (Array.isArray(order)) {
      result = compareValueByReference(valueA, valueB, order);
    }

    // custom function
    else if (typeof order === 'function') {
      result = order(valueA, valueB);
    }

    // default
    else {
      result = 0;
    }

    if (isNaN(result)) {
      warn(
        `field compare get NaN. compare field name is '${sort}', A value is '${valueA}', B value is '${valueB}'.`
      );

      return 0;
    }

    return result;
  };
}

/**
 * Util console warn
 *
 * @param message
 */
function warn(message: string) {
  console.warn(`[Util warn] util 'sortBy' compare warning, ${message}`);
}

/**
 * 陣列多條件排序
 *
 * ----
 *
 * @example
 *
 * ```ts
 * const array = [
 *   {
 *     a: 1,
 *     b: 2,
 *   },
 *   {
 *     a: 1,
 *     b: 3,
 *   },
 * ];
 *
 * // 先依照 a 欄位 `ASC` 排序，相同時才再依照第二個條件排序(b 欄位 `DESC` 排序)
 * sortBy(array, [
 *   {
 *     sort: 'a',
 *     order: SortOrder.Asc,
 *   },
 *   {
 *     sort: 'b',
 *     order: SortOrder.Desc,
 *   },
 * ]);
 *
 * // 依據一組陣列做排序參考
 * sortBy(array, [
 *   {
 *     sort: 'a',
 *     order: SortOrder.Asc,
 *   },
 *   {
 *     sort: 'b',
 *     order: [3], // 參考陣列
 *   },
 * ]);
 *
 * // 自定義排序 Function
 * sortBy(array, [
 *   {
 *     sort: 'a',
 *     order: SortOrder.Asc,
 *   },
 *   {
 *     sort: 'b',
 *     order: (valueA, valueB) => {
 *       return valueA - valueB
 *     },
 *   },
 * ]);
 * ```
 *
 * @param value 陣列
 * @param sorts 排序條件
 * @returns
 */
export function sortBy<T extends Record<string, any>>(value: T[], sorts: Sort[]): T[];
export function sortBy<T extends Record<string, any>, S = any>(value: T[], sorts: Sort<S>[]): T[];
export function sortBy<T extends Record<string, any>, S = any>(
  value: T[],
  ...sorts: Sort<S>[]
): T[];

export function sortBy(value: any[], arg1: Sort | Sort[], ...args: Sort[]): any[] {
  if (Array.isArray(arg1)) {
    args = arg1;
  } else {
    args = [arg1, ...args];
  }

  // 排序條件轉換排序 function
  const compares = args.map((item) => compareFactory(item));

  return value.sort((a, b) => {
    return compares.reduce(
      (result, compare) => result || compare(a, b),
      0 /* default compare value */
    );
  });
}
