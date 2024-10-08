import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { setCredentials } from "./authenticationSlice";
// Function to extract the JWT from cookies

// // Define the base URL from the environment variable
const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}`;

export const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: baseQuery,

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/login",
        method: "POST",
        body: credentials,
      }),
      // Save the token after login
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data", data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          Cookies.set("token", data?.token, { expires: 7 });
          Cookies.set("role", data?.role, { expires: 7 });
          Cookies.set(
            "loggedInUser",
            JSON.stringify(data?.user),
            { expires: 7 }
          );
          dispatch(
            setCredentials({
              token: data.token,

              user: {
                id: data.user?.id,
                name: data.user?.name,
                email: data.user?.email,
                phone_number: data.user?.phone_number,
                role: data.user?.role,
              },
            })
          );
        } catch (error) {
          // Handle error
        }
      },
    }),
    register: builder.mutation({
      query: (userDetails) => ({
        url: "api/register",
        method: "POST",
        body: userDetails,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "api/user",
        method: "GET",
      }),
    }),
  }),
});

// Export the hooks generated by RTK Query
export const { useLoginMutation,useRegisterMutation, useGetUserQuery } =
  authenticationApi;
