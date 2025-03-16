import axios from "axios";
import { toast } from "react-hot-toast";

export const handleApiError = (error: unknown): void => {
  console.log("Error received:", error);

  // Check if the error is from Axios
  if (axios.isAxiosError(error)) {
    const errorName = error.response?.data?.name;
    const message = error.response?.data?.message || error.message;

    if (errorName === "ValidationError") {
      if (error?.response?.data?.errors) {
        error.response?.data?.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error(error?.response?.data?.message);
      }
    } else {
      toast.error(message);
    }
  }
  // Check if the error is from RTK Query
  else if (error && typeof error === "object" && "data" in error) {
    const rtkError = error as any; // Explicit typing for RTK Query error
    const message = rtkError.data?.message || "An error occurred.";

    // Handle validation errors from RTK Query (if your API provides them)
    if (rtkError.data?.errors && Array.isArray(rtkError.data.errors)) {
      rtkError.data.errors.forEach((err: any) => {
        toast.error(err.message);
      });
    } else {
      toast.error(message);
    }
  } else {
    // Unexpected error handling
    console.error("Unexpected Error:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
