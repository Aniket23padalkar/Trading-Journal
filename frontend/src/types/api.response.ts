export type ApiResponse<T> =
  | { success: true; data: T; message: string }
  | { success: false; message: string };

type DeleteData = { trade_id: string };

export interface DeleteResponse {
  success: boolean;
  data: DeleteData;
  message: string;
}
