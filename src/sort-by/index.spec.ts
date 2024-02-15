import { describe, it, expect } from 'vitest';

import { sortBy, SortOrder } from './';

describe('sortBy', () => {
  it('sort multiple fields by sort order object', () => {
    // compare number
    expect(
      sortBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: SortOrder.Desc },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: 3 },
      { a: 1, b: 2 },
    ]);

    // compare string
    expect(
      sortBy(
        [
          { a: 1, b: 'ab' },
          { a: 1, b: 'ac' },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: SortOrder.Desc },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: 'ac' },
      { a: 1, b: 'ab' },
    ]);

    // compare Date
    expect(
      sortBy(
        [
          { a: 1, b: new Date('2024/01/01') },
          { a: 1, b: new Date('2024/01/02') },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: SortOrder.Desc },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: new Date('2024/01/02') },
      { a: 1, b: new Date('2024/01/01') },
    ]);

    // compare boolean
    expect(
      sortBy(
        [
          { a: 1, b: false },
          { a: 1, b: true },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: SortOrder.Desc },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: true },
      { a: 1, b: false },
    ]);
  });

  it('sort multiple fields by reference array', () => {
    // compare number
    expect(
      sortBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: [3, 2, 1] },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: 3 },
      { a: 1, b: 2 },
    ]);

    // compare string
    expect(
      sortBy(
        [
          { a: 1, b: 'ab' },
          { a: 1, b: 'ac' },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          { sort: 'b', order: ['ac', 'ab'] },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: 'ac' },
      { a: 1, b: 'ab' },
    ]);
  });

  it('sort multiple fields by custom sorting function', () => {
    expect(
      sortBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [
          { sort: 'a', order: SortOrder.Asc },
          {
            sort: 'b',
            order: (valueA, valueB) => {
              return valueA - valueB;
            },
          },
        ]
      )
    ).toStrictEqual([
      { a: 1, b: 2 },
      { a: 1, b: 3 },
    ]);
  });
});
