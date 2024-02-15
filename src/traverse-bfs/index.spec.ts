import { describe, it, expect } from 'vitest';

import { traverseBFS } from '.';

describe('traverseBFS', () => {
  it('traverse tree nodes with BFS', () => {
    const tree = {
      // #1
      id: '1',
      children: [
        {
          // #2
          id: '1.1',
          children: [
            // #5
            {
              id: '1.1.1',
              children: [
                // #7
                { id: '1.1.1.1' },
                // #8
                { id: '1.1.1.2' },
                // #9
                { id: '1.1.1.3' },
              ],
            },
            // #6
            { id: '1.1.2' },
          ],
        },
        // #3
        { id: '1.2' },
        // #4
        { id: '1.3' },
      ],
    };

    let count = 0;
    const result = traverseBFS(tree, 'children', ({ id }) => {
      count++;
      return id === '1.1.1.1';
    });

    expect(result).toStrictEqual({ id: '1.1.1.1' });
    expect(count).toBe(7);
  });
});
