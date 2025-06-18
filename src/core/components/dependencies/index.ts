export { Context, Provider, useDependencyContext } from './context';
export type { Props } from './types';

export const DefaultDateFormatter = (date: Date | null | undefined) => {
  return date ? date.toISOString() : '';
};
