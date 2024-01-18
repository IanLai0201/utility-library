import { describe, it, expect } from 'vitest';

import { traverseDFS } from '.';

describe('traverseDFS', () => {
  it('traverse tree nodes with DFS', () => {
    const tree = {
      // #1
      id: '1',
      children: [
        {
          // #2
          id: '1.1',
          children: [
            // #3
            {
              id: '1.1.1',
              children: [
                // #4
                { id: '1.1.1.1' },
                // #5
                { id: '1.1.1.2' },
                // #6
                { id: '1.1.1.3' },
              ],
            },
            // #7
            { id: '1.1.2' },
          ],
        },
        // #8
        { id: '1.2' },
        // #9
        { id: '1.3' },
      ],
    };

    let count = 0;
    const result = traverseDFS(tree, 'children', ({ id }) => {
      count++;
      return id === '1.1.1.3';
    });

    expect(result).not.toBeNull();
    expect(count).toBe(6);
  });
});
