"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRegisterMutation } from "../../../redux/authentication/authenticationApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();


  const router = useRouter();
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ name, email, password }).unwrap();
    //   console.log("response",response);
      toast({ title: "Signed Up Successfully" });
    router.push("/login");
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  return (
    <div className="mt-20">
      <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Max"
                required
              />
            </div>
            
          </div>

          {/* Email field */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your Email"
              required
            />
          </div>

          {/* Password field */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Create an account"}
          </Button>


          {/* Error message */}
          {error && (
            <div className="mt-4 text-red-500">
              Registration failed. {error.data?.message}
            </div>
          )}

          {/* Already have an account? */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
    
  );
}
