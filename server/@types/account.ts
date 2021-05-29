export interface Account {
  id: string;
  name: string;
  currentBalance: number;
  initialBalance: number;
  currency: string;
  isActive: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}
