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
  useAssignRoleToUserMutation,
  useAssignRoleWithPermissionsMutation,
  useEditUserMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
} from "../../redux/userApi";
import { permission, title } from "process";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ManageUserModal({ userId, user }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    role_name: "",
  
  });

  // console.log("form",form);

  const {
    data: getAllRoles,
    isLoading: rolesLoading,
    isSuccess: rolesSuccess,
    isError: rolesError,
    error: rolesErrorMessage,
  } = useGetRolesQuery({});



  const { toast } = useToast();
  const [assignRole] = useAssignRoleToUserMutation();

  const handleRoleSelect = (roleName) => {
    setForm((prevForm) => ({
      ...prevForm,
      role_name: roleName,
    }));

    
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        role_name: form.role_name,
       
      };

      await assignRole({
        userId,
        userData
      }).unwrap();

      setIsOpen(false);
      toast({ title: "User Roles Updated Successfully!" });
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
        toast({ title: "Failed to Assign Role" });
      }
    }
  };

 
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Role</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[1000px]">
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogTitle>Assign Roles To User</DialogTitle>
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

            
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
