export type helperResponse<T=unknown> = {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
};
