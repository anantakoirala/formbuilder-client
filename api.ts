import axios from "axios";
export const BASE_URL = process.env.NEXT_PUBLIC_API;

const restApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
restApi.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// restApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     // Check if the error is due to an expired token (401)
//     if (error.response && error.response?.status === 401) {
//       const message = error.response?.data?.message;

//       console.log("invalid token");

//       // If token not provided, redirect to sign-in
//       if (message === "Token not provided") {
//         window.location.href = "/login"; // Redirect user to the sign-in page
//         return Promise.reject(error); // Stop further processing
//       }
//       if (message === "Token expired") {
//         try {
//           // Call the refresh token endpoint to get a new access token
//           const refreshResponse = await axios.post(
//             `${BASE_URL}/api/v1/auth/refresh-token`,
//             {},
//             { withCredentials: true }
//           );

//           // Retry the original request
//           return restApi(originalRequest);
//         } catch (refreshError) {
//           // Handle refresh token errors
//           console.log("refreshError", refreshError);
//           console.error("Error during token refresh:", refreshError);
//           // Redirect to sign-in or show an error message
//           window.location.href = "/login"; // Redirect to the login page
//         }
//       }
//       // Invalid token or other 401 errors
//       window.location.href = "/login"; // Redirect to the login page
//     }
//     return Promise.reject(error); // Return the error for other cases
//   }
// );
export { restApi };
