import { describe, it, expect } from 'vitest';

import { formatMessage } from './';

describe('formatMessage', () => {
  it('format message with array parameters', () => {
    expect(formatMessage('message: {{0}}', ['test'])).toBe('message: test');
  });

  it('format message with object parameters', () => {
    expect(formatMessage('{{a}} message: {{b}}', { a: 'replace1', b: 'replace2' })).toBe(
      'replace1 message: replace2'
    );
  });

  it('format message with custom template', () => {
    expect(formatMessage('message: {0}', ['test'], { start: '{', end: '}' })).toBe('message: test');
  });
});
