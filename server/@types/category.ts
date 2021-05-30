import { ObjectId } from 'bson';

export interface Category {
  id: string;
  name: string;
  parentCategory: Category | ObjectId | null;
  isActive: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
