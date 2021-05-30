export interface Category {
  id: string;
  name: string;
  parentCategory: string | null;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
