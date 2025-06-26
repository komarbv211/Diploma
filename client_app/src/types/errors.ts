export type ApiError = {
  data?: {
    errors?: Record<string, string[]>;
    message?: string;
  };
  status?: number;
};
