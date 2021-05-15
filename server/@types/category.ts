export interface Category {
  name: string;
  parent: Category | null;
  isActive: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
