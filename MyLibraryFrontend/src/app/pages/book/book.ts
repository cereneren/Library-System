export interface Book {
  id: number;
  title: string;
  author: string;
  available?: boolean;
  coverUrl?: string;
  coverEndpoint?: string;
  summary: string;
  dateCreated: string;
  dateUpdated: string;
  totalCopies: number;
  availableCopies: number;
}
