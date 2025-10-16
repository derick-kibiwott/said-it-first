export type Quote = {
  id: number;
  quote: string;
  author: string | null;
  created_at: string;
};
export type ApiResponse<T> = {
  data: T | null;
  message: string;
  success: boolean;
};
