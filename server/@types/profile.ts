import { Account } from './account';
import { Category } from './category';

export interface Profile {
  accounts: Account[];
  categories: Category[];
}
