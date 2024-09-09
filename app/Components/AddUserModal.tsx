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
import { useAddUserMutation } from "../../redux/userApi";
import { title } from "process";


export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    phone_number: "",
  });

  const { toast } = useToast();
  const [addUser] = useAddUserMutation();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Send the form data to the server via RTK Query mutation
  //     await addUser(form).unwrap();
  //     toast({ title: "User added successfully!" });
  //     setIsOpen(false);
  //   } catch (error) {
  //     console.error("Failed to add user", error);

  //     // Check if the error response contains a status code
  //     if (error?.status === 403) {
  //       toast({ title: error?.data?.message });
  //     } else {
  //       toast({ title: "Failed to Add User" });
  //     }
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send the form data to the server via RTK Query mutation
      await addUser(form).unwrap();
      toast({ title: "User added successfully!" });
     
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add user", error);
  
   
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
    <Dialog  open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add User</Button>
       
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the user details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            {/* Email Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            {/* Phone Number Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            {/* Avatar Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                className="col-span-3"
              />
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
