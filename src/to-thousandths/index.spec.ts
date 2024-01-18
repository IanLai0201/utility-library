import { describe, it, expect } from 'vitest';

import { toThousandths } from '.';

describe('toThousandths', () => {
  it('empty value format thousandths', () => {
    expect(toThousandths(undefined)).toBe('');
    expect(toThousandths(null)).toBe('');
    expect(toThousandths(NaN)).toBe('');
  });

  it('string value format thousandths', () => {
    expect(toThousandths('')).toBe('');
    expect(toThousandths('test')).toBe('test');
    expect(toThousandths('1000')).toBe('1,000');
    expect(toThousandths('10000000')).toBe('10,000,000');
  });

  it('number value format thousandths', () => {
    expect(toThousandths(0)).toBe('0');
    expect(toThousandths(1000)).toBe('1,000');
    expect(toThousandths(10000000)).toBe('10,000,000');
  });

  it('value with decimals format thousandths', () => {
    expect(toThousandths('0.0001')).toBe('0.0001');
    expect(toThousandths(0.0001)).toBe('0.0001');
    expect(toThousandths('1000.0001')).toBe('1,000.0001');
    expect(toThousandths(1000.0001)).toBe('1,000.0001');
  });
});
