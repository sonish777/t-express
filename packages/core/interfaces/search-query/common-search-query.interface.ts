import { PaginationOptions } from '../pagination/pagination-options.interface';

export interface CommonSearchQuery extends PaginationOptions {
  keywords?: string;
  active?: boolean | [column: string, value: string | boolean];
}
