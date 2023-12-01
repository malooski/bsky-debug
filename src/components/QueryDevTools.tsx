import { lazy } from "react";

export const QueryDevTools =
    process.env.NODE_ENV === "production"
        ? () => null // Render nothing in production
        : lazy(() =>
              // Lazy load in development
              import("@tanstack/react-query-devtools").then(res => ({
                  default: res.ReactQueryDevtools,
              })),
          );
