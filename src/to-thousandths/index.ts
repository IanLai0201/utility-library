import { isNaN, isNil } from 'lodash-es';

/**
 * 千分位符號
 *
 * @param value
 * @returns
 */
export function toThousandths(value: number | string | null | undefined) {
  if (isNil(value) || isNaN(value)) {
    return '';
  }

  return String(value).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 移除千分位符號
 *
 * @param value
 * @returns
 */
export function removeThousands(value: string) {
  return value.replace(/,/g, '');
}
