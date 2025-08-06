import { Book } from '../book/book';
import { Member } from '../member/member';

export interface Loan {
  id: number;
  book: Book;
  member: Member;
  loanDate: string; // ISO format date string (e.g., "2023-12-31")
  dueDate: string;
  returnDate: string | null;
}
