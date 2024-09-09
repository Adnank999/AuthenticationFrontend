"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddUserMutation,
  useAssignRoleWithPermissionsMutation,
  useEditUserMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
} from "../../redux/userApi";
import { permission, title } from "process";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ManageUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectRole, setSelectRole] = useState("");
  const [form, setForm] = useState({
    role_name: "",
    permissions: [],
  });

  // console.log("form",form);

  const {
    data: getAllRoles,
    isLoading: rolesLoading,
    isSuccess: rolesSuccess,
    isError: rolesError,
    error: rolesErrorMessage,
  } = useGetRolesQuery({});

  const {
    data: getAllPermissions,
    isLoading: permissionsLoading,
    isSuccess: permissionsSuccess,
    isError: permissionsError,
    error: permissionsErrorMessage,
  } = useGetPermissionsQuery({});

  const { toast } = useToast();
  const [manageUser] = useAssignRoleWithPermissionsMutation();

  const handleRoleSelect = (roleName) => {
    setForm((prevForm) => ({
      ...prevForm,
      role_name: roleName,
    }));

    setSelectRole(roleName);
  };

  const handlePermissionToggle = (permissionName) => {
    setForm((prevForm) => {
      // Toggle the permission in the array
      const isPermissionSelected =
        prevForm.permissions.includes(permissionName);
      const updatedPermissions = isPermissionSelected
        ? prevForm.permissions.filter((perm) => perm !== permissionName) // Remove permission if selected
        : [...prevForm.permissions, permissionName]; // Add permission if not selected

      return {
        ...prevForm,
        permissions: updatedPermissions,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        role_name: form.role_name,
        permissions: form.permissions,
      };

      await manageUser(userData).unwrap();

      setIsOpen(false);
      toast({ title: "User Roles and Permission Updated Successfully!" });
    } catch (error) {
      console.error("Failed to update user", error);

      if (error?.status === 422) {
        const validationErrors = error?.data?.errors;
        let errorMessages = "";

        Object.keys(validationErrors).forEach((field) => {
          errorMessages += validationErrors[field].join(" ") + " ";
        });

        toast({ title: errorMessages.trim() });
      } else if (error?.status === 403) {
        toast({ title: error?.data?.message });
      } else {
        toast({ title: "Failed to Add User" });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Roles & Permission</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[1000px]">
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogTitle>Assign Roles and Permissions</DialogTitle>
          <DialogDescription>
            Fill in the user details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Role Name Field as Selectable Badge */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role_name" className="text-right">
                Role Name
              </Label>
              <div className="col-span-3">
                <div className="flex gap-2">
                  {rolesSuccess &&
                    getAllRoles?.map((role) => (
                      <div
                        key={role.id}
                        className={`cursor-pointer text-sm text-center px-3 py-1 rounded-md ${
                          form?.role_name === role?.name
                            ? "bg-red-800 text-white"
                            : "bg-black"
                        }`}
                        onClick={() => handleRoleSelect(role.name)} // Set the role_name in form
                      >
                        {role.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Permissions Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permissions" className="text-right">
                Grant Permissions
              </Label>
              <div className="col-span-3">
                <div className="flex gap-2">
                  {permissionsSuccess &&
                    getAllPermissions?.map((permission) => (
                      <div
                        key={permission.id}
                        className={`cursor-pointer text-sm text-center px-3 py-1 rounded-md ${
                          form.permissions.includes(permission.name)
                            ? "bg-red-800 text-white"
                            : "bg-black"
                        }`}
                        onClick={() => handlePermissionToggle(permission.name)} // Toggle permission in form
                      >
                        {permission.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
