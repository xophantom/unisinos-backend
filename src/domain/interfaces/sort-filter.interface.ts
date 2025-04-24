import { SortDirection } from './sort-direction.interface';

export type SortFilter<T> = Partial<Record<keyof T, SortDirection>>;
