import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API;

const restApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensure cookies (refresh token) are sent
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

restApi.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

restApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message;
      console.log("Axios Interceptor 401:", message);

      if (message === "Token not provided") {
        window.location.href = "/login"; // Redirect user to login
        return Promise.reject(error);
      }

      if (message === "Unauthorized") {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResponse = await axios.post(
              `${BASE_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );

            const newAccessToken = refreshResponse.data.accessToken;
            console.log("New Access Token:", newAccessToken);

            onRefreshed(newAccessToken);
            isRefreshing = false;

            // Retry the failed request with new token
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return restApi(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            isRefreshing = false;
            window.location.href = "/login"; // Redirect if refresh fails
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(restApi(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export { restApi };
