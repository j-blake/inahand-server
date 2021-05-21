import { Account } from './account';
import { Category } from './category';

export interface Profile {
  id: string;
  accounts: Account[];
  categories: Category[];
}
