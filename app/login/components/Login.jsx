"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { useLoginMutation } from "../../../redux/authentication/authenticationApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log("Login successful:", response);

      const token = response.token;

      localStorage.setItem("token", token);
      const role = localStorage.getItem("role");

      // console.log("role",role)

      if (token && role === "Admin") {
        router.push("/dashboard/admin");
      }else if (token && role === "Manager") {
        router.push("/dashboard/manager");
      }if (token && role === "User") {
        router.push("/dashboard/user");
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div className="mt-4 text-red-500">
            Login failed. {error.data?.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
