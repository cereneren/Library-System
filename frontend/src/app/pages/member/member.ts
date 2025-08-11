export interface Member {
  id: number;
  fullName: string,
  email: string,
  password: string,
  totalLoans?: number;
  dateCreated?: string;
  dateUpdated?: string;
}
export interface MemberCreateRequest {
  fullName: string;
  email: string;
  password: string;
}
