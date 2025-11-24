"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance per component lifecycle (important in client components)
  // const defaultOptions = {
  //   queries: {
  //     refetchOnWindowFocus: false,
  //     retry: (failureCount, error) => {
  //       const statusCode = error?.status;

  //       // Do not retry if error is 4xx
  //       const code = getStatusCode(error);
  //       if (code && code >= 400 && code < 500) {
  //         return false;
  //       }
  //       return failureCount < 3;
  //     },
  //   },
  // };

  // TODO : Move defaultOptions inside QueryClient, and Extend default Error type to include status
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function getStatusCode(error: unknown): number | null {
  if (error instanceof AxiosError) {
    return error.response?.status || null;
  } else if (error instanceof Error) {
    // Handle other error types if necessary
    return null;
  }
  return null;
}
export default QueryProvider;
