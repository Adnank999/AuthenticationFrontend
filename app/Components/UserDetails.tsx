import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSingleUserQuery } from "../../redux/userApi";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the import path for the Skeleton component
import { FiEye } from "react-icons/fi";
interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string | null;
  avatar: string | null;
  role_id: number;
  role: Role;
  created_at: string;
  updated_at: string;
}

interface Props {
  userId: number;
}

const UserDetails = ({ userId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const {
    data: userData,
    error,
    isError,
    isLoading,
  } = useSingleUserQuery(userId);

  // Update user data when it finishes loading
  useEffect(() => {
    if (userData && !isLoading) {
      setUser(userData.user); // Set user only when data is loaded
    }
  }, [userData, isLoading]);

  const handleShowUserDetails = () => {
    setIsOpen(true); // Open the dialog
  };

  console.log("userData", user);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={handleShowUserDetails}
          >
            <FiEye className="w-5 h-5" />
          </button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className=" max-w-[1000px] h-[300px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Details of the selected user are shown below:
            </DialogDescription>
          </DialogHeader>

          {/* Loading State: Render skeleton if isLoading */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}

          {/* Error State */}
          {isError && <p>Error loading user details</p>}

          {/* User Details Table */}
          {!isLoading && user && (
            <table className="mt-4 w-full">
              <thead>
                <tr className="text-center">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone_number}</td>
                  <td>
                    {user?.roles?.length > 0
                      ? user?.roles?.map((role, index) => (
                          <span key={role?.id}>
                            {role?.name}
                            {index < user?.roles?.length - 1 && ", "}
                          </span>
                        ))
                      : "No Roles"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetails;
