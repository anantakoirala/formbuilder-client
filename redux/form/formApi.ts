import { api } from "../api";
import { setBlocks, setForm } from "./formSlice";

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
          if (result.data.result.jsonBlocks.length > 0) {
            dispatch(setBlocks(result.data.result.jsonBlocks[0]));
          }
        } catch (error: any) {
          console.log("updated errir");
          console.log(error);
        }
      },
    }),
    updateForm: builder.mutation({
      query: ({ data, formId }) => {
        console.log("data", data);
        return {
          url: `/api/forms/${formId}`,
          method: "PATCH",
          body: data, // Send the data object directly
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("result update", result.data);
          dispatch(setForm(result.data));
          // dispatch(setForm(result.data.result));
          // if (result.data.result.jsonBlocks.length > 0) {
          //   dispatch(setBlocks(result.data.result.jsonBlocks[0]));
          // }
        } catch (error: any) {
          console.log("updated errir");
          console.log(error);
        }
      },
    }),
    getPublicForm: builder.query({
      query: ({ id }) => {
        return {
          url: `/api/public/${id}`,
          method: "GET",
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
      keepUnusedDataFor: 0, // Disables caching
    }),
    submitForm: builder.mutation({
      query: (formData) => {
        console.log("FormData being sent:", formData);
        return {
          url: `/api/public/submit-form`,
          method: "POST",
          body: formData, // Send FormData directly
          credentials: "include" as const,
          // REMOVE "Content-Type": "application/json" - Browser will set it
        };
      },
    }),
    getFormResponses: builder.query({
      query: ({ id }) => {
        return {
          url: `/api/response/${id}`,
          method: "GET",
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
    }),
    deleteForm: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/api/forms/${id}`,
          method: "DELETE",
          credentials: "include" as const,
          headers: {
            "Content-Type": "application/json", // Ensure headers are set
          },
        };
      },
      invalidatesTags: ["forms"],
    }),
  }),
});

export const {
  useCreateFormMutation,
  useLazyGetAllFormsQuery,
  useLazyGetFormQuery,
  useUpdateFormMutation,
  useLazyGetPublicFormQuery,
  useSubmitFormMutation,
  useLazyGetFormResponsesQuery,
  useDeleteFormMutation,
} = formApi;
