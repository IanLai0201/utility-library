import { beforeEach, describe, it, expect, vi } from 'vitest';

import { exclusive } from './';

describe('exclusive', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('excute function after synchronous function', () => {
    let count = 0;

    const execFunction = exclusive((...args: any) => {
      count++;
      return args;
    });

    execFunction('1');
    expect(count).toBe(1);
    execFunction('2');
    expect(count).toBe(2);
  });

  it('stop excute function when last asynchronous function not finish', async () => {
    let count = 0;

    const execPromise = exclusive((...args: any) => {
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
  });

  it('excute function after last asynchronous function', async () => {
    let count = 0;

    const execPromise = exclusive((...args: any) => {
      count++;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(args);
        }, 2000);
      });
    });

    execPromise('1');
    expect(count).toBe(1);

    // await 3sec
    setTimeout(() => {
      execPromise('2');
    }, 3000);

    await vi.runAllTimersAsync();
    expect(count).toBe(2);
  });
});
