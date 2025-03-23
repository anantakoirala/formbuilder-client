import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom base query with token refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API,
  credentials: "include",
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const message = (result.error.data as { message?: string })?.message;
    console.log("redux api message", message);
    if (message === "Unauthorized") {
      try {
        console.log("ya aayo");
        // Try refreshing the token
        const refreshResult = await baseQuery(
          { url: "/api/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );
        console.log("refresh result", refreshResult);

        if (refreshResult.data) {
          const { token } = refreshResult.data as { token: string };

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Redirect to login if refresh fails
          console.log("redirect if refresh fails");
          window.location.href = "/login";
        }
      } catch {
        // Refresh failed, redirect to login
        console.log("redirect tologin");
        window.location.href = "/login";
      }
    } else if (message === "Token not provided") {
      // Redirect to login if token is missing
      console.log("login if token missing");
      window.location.href = "/login";
    } else {
      console.log("login if token missing");
      window.location.href = "/login";
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["forms"],
});

export const {} = api;
