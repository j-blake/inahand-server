export interface Account {
  id: string;
  name: string;
  currentBalance: number;
  initialBalance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
