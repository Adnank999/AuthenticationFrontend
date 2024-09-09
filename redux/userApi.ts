import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./authentication/authenticationApi";

const getRolePrefix = () => {
  const role = localStorage.getItem("role");
  return role === "Admin"
    ? "admin"
    : role === "Manager"
    ? "manager"
    : role === "User"
    ? "user"
    : "";
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Add a new user
    addUser: builder.mutation({
      query: (userData) => {
        // const rolePrefix = getRolePrefix();
        return {
          url: `api/addUser` /* /${rolePrefix} */,
          method: "POST",
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),

    // Get all users
    getUsers: builder.query({
      query: () => {
        return {
          url: `api/getUsers`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    singleUser: builder.query({
      query: (userId) => {
        return {
          url: `api/getUser/${userId}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // Edit a user
    editUser: builder.mutation({
      query: ({ userId, userData }) => {
        return {
          url: `api/edit/${userId}`,
          method: "PATCH",
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: (userId) => {
        return {
          url: `api/delete/${userId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["User"],
    }),
    getRoles: builder.query({
      query: () => {
        return {
          url: `api/getRoles`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    getPermissions: builder.query({
      query: () => {
        return {
          url: `api/getAllPermissions`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    assignRoleToUser: builder.mutation({
      query: ({ userId, userData }) => {
        return {
          url: `api/permissions/assign-role/${userId}`,
          method: "POST",
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),
    assignRoleWithPermissions: builder.mutation({
      query: (userData) => {
        return {
          url: `api/permissions/assign-role-with-permissions`,
          method: "POST",
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),

    revokeRoleWithPermissions: builder.mutation({
      query: ({ userId, userData }) => {
        const rolePrefix = getRolePrefix();

        return {
          url: `api/permissions/revoke-role-with-permissions/${userId}`,
          method: "POST",
          body: userData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useAddUserMutation,
  useGetUsersQuery,
  useSingleUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetPermissionsQuery,
  useAssignRoleToUserMutation,
  useAssignRoleWithPermissionsMutation,
  useRevokeRoleWithPermissionsMutation,
} = userApi;
