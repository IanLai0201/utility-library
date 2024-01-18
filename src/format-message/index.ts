import { escapeRegExp } from 'lodash-es';

export type Args = string[] | { [key: string]: any };
export type Template = { start: string; end?: string };

/**
 * 格式化文字
 *
 * @example
 *
 * ```ts
 * // 傳入陣列，依陣列 index 替換相對應位置
 * formatMessage('範例文字: {{0}}', ['替']);
 *
 * // 傳入物件，依物件 key 替換相對應位置
 * formatMessage('{{a}} 範例文字: {{b}}', { a: '替1', b: '替2' });
 * ```
 *
 * @param {string} msg 文字樣版
 * @param {Args} args 替換參數
 * @param {Template} [template={ start: '{{', end: '}}' }] 樣版開頭與結尾, 預設 {{ }}
 * @returns {string} 格式化後的文字
 */
export function formatMessage(
  msg: string,
  args: Args,
  template: Template = { start: '{{', end: '}}' }
): string {
  const start = escapeRegExp(template.start);
  const end = escapeRegExp(template.end || '');

  const regExp = new RegExp(`${start}([\\w\\d]+)${end}`, 'gi');

  return msg.replace(regExp, (t, key) => {
    const value = Array.isArray(args) ? args[key] : args[String(key)];

    return value === undefined ? t : String(value);
  });
}
