import { beforeEach, describe, it, expect, vi } from 'vitest';

import { exclusive } from './';

describe('exclusive', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('exclusive excute function', async () => {
    let count = 0;

    const execPromise = exclusive((args: string) => {
      count++;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(args);
        }, 2000);
      });
    });

    execPromise('1');
    expect(count).toBe(1);
    execPromise('2');
    expect(count).toBe(1);

    // await 1sec
    setTimeout(() => {
      execPromise('3');
    }, 1000);

    await vi.runAllTimersAsync();
    expect(count).toBe(1);

    // await 3sec
    setTimeout(() => {
      execPromise('4');
    }, 3000);

    await vi.runAllTimersAsync();
    expect(count).toBe(2);
  });
});
