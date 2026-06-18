import { Account } from './account.model';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface TransactionRequest {
  accountId: number;
  type: TransactionType | string; // acepta string si la UI envía 'DEPOSIT'/'WITHDRAW'
  amount: number;
}

export interface TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  createdAt: string; // ISO date string; tu código puede convertir a Date si quieres
  account: Account;
}
