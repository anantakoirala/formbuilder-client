import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API;

const restApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies with every request
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Request interceptor
restApi.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
restApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message;

      // No refresh token scenario
      if (message === "Token not provided") {
        // Redirect to login if no refresh token
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Expired access token scenario
      if (message === "Unauthorized") {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await axios.post(
              `${BASE_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true } // Refresh token cookie will be sent
            );

            onRefreshed();
            isRefreshing = false;

            return restApi(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            isRefreshing = false;
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Queue failed requests until refresh completes
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(restApi(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export { restApi };
