import React from "react";
import {
  Table as CustomTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditUserModal } from "./EditUserModal";
import UserDetails from "./UserDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ManageUserModal from "../Components/ManageUserModal";
import { AddUserModal } from "./AddUserModal";
import RevokePermissionModal from "./RevokePermissionModal";
import AssignRoles from "./AssignRoles";
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

type Props = {
  users: User[];
  handleDeleteUser: any;
  role: string;
};

const Table = ({ users, handleDeleteUser, role }: Props) => {
  return (
    <div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row justify-center items-center gap-40">
          <div className="flex flex-col justify-center items-center gap-4">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage your Users and their Roles and Permissions.
            </CardDescription>
          </div>
          {(role === "Admin" || role === "Manager") && (
          <AddUserModal />
          )}
          {role === "Admin" && <ManageUserModal />}
        </CardHeader>
      </Card>

      <CustomTable className="mt-10 w-full">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Phone Number</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: User) => (
            <TableRow key={user?.id} className="text-center">
              <TableCell className="hidden sm:table-cell">
                <div className="flex justify-center">
                  <Image
                    alt="User Image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={user?.avatar ? user.avatar : "/default-avatar.png"}
                    width="64"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-center">
                {user.name}
              </TableCell>
              <TableCell className="text-center">{user.email}</TableCell>
              <TableCell className="text-center">{user.phone_number}</TableCell>

              {role === "Admin" ? (
                <TableCell className="flex flex-row justify-center items-center text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="mx-auto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="flex flex-col justify-center items-center gap-2"
                    >
                      <AssignRoles userId={user?.id} user={user} />

                      <RevokePermissionModal userId={user?.id} user={user} />
                      <EditUserModal userId={user?.id} user={user} />

                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user?.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <UserDetails userId={user?.id} />
                </TableCell>
              ) : role === "Manager" ? (
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="mx-auto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="flex flex-col justify-center items-center gap-2"
                    >
                      {/* <ManageUserModal /> */}
                      {/* <RevokePermissionModal userId={user?.id} user={user}/> */}
                      <EditUserModal userId={user?.id} user={user} />

                      {/* <DropdownMenuItem
                          onClick={() => handleDeleteUser(user?.id)}
                        >
                          Delete
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <UserDetails userId={user?.id} />
                </TableCell>
              ) : (
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="mx-auto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    {/* <DropdownMenuContent
                        align="end"
                        className="flex flex-col justify-center items-center gap-2"
                      >
                        <ManageUserModal/>
                        <RevokePermissionModal userId={user?.id} user={user}/>
                        <EditUserModal userId={user?.id} user={user} />

                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user?.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent> */}
                  </DropdownMenu>
                  <UserDetails userId={user?.id} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </CustomTable>
    </div>
  );
};

export default Table;
