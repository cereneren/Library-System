import { Book } from '../book/book';
import { Member } from '../member/member';

export interface Loan {
  id: number;
  book: { id: number; title: string; author?: string };
  loanDate: string;   // ISO
  dueDate: string;    // ISO
  returnDate?: string | null;
  overdue?: boolean;
}

