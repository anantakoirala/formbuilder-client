import { api } from "../api";
import { setForm } from "./formSlice";

export const formApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createForm: builder.mutation({
      query: (data) => {
        console.log("data api", data);
        return {
          url: `/api/forms/`,
          method: "POST",
          body: data,
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
      invalidatesTags: ["forms"],
    }),
    getAllForms: builder.query({
      query: () => {
        return {
          url: `/api/forms/`,
          method: "GET",
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
      providesTags: ["forms"],
    }),
    getForm: builder.query({
      query: ({ id }) => {
        return {
          url: `/api/forms/${id}`,
          method: "GET",
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(setForm(result.data.result));
        } catch (error: any) {
          console.log("updated errir");
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useCreateFormMutation,
  useLazyGetAllFormsQuery,
  useLazyGetFormQuery,
} = formApi;
