"use client";
import Image from "next/image";
import Link from "next/link";
import { Toggle } from "./Toogle";

import { Home, PanelLeft, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useSingleUserQuery,
} from "../../redux/userApi";
import { useEffect, useState } from "react";
import { AddUserModal } from "./AddUserModal";
import useAuth from "../../utils/checkAuth";
import { EditUserModal } from "./EditUserModal";
import { useToast } from "@/hooks/use-toast";
import UserDetails from "./UserDetails";
import Table from "./Table";
import Loading from "./Loading";

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
};

export function Dashboard({ users }: Props) {
  useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  };

  const [deleteUser] = useDeleteUserMutation();
  const { toast } = useToast();
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();

      toast({ title: "User Deleted Successfully!" });
    } catch (error) {
      console.error("Failed to delete user", error);
      toast({ title: "Failed to Delete User" });
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading users</div>;

  console.log("users", users);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    }
    setLoading(false);
  }, [loading]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/home"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/user"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="relative ml-auto flex-1 md:grow-0">
            <div>
              <Toggle />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full w-24 h-24"
              >
                {loading ? (
                  <Loading />
                ) : (
                  role && (
                    <Image
                      src={
                        role === "Admin"
                          ? "/Admin.png"
                          : role === "Manager"
                          ? "/Manager.png"
                          : "/User.png"
                      }
                      width={100}
                      height={100}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                    />
                  )
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            <h1>{role}</h1>
          </DropdownMenu>
        </header>

        {/* <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader className="flex flex-row justify-center items-center gap-40">
              <div className="flex flex-col justify-center items-center">
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage your Users and their Roles and Permissions.
                </CardDescription>
              </div>

              {(role === "Admin" || role === "Manager") && <AddUserModal />}
            </CardHeader>
            <CardContent>
              <Table
                users={users}
                handleDeleteUser={handleDeleteUser}
                role={role}
              />
            </CardContent>
          </Card>
        </main> */}
      </div>
    </div>
  );
}
