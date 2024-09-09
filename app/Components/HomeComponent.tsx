"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const HomeComponent = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedUser = Cookies.get("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser)); // Parse and set the user after hydration
    }
    setIsMounted(true); // Indicate that the component is now mounted
  }, []);

  if (!isMounted) {
    // During SSR, do not render the content that depends on loggedInUser
    return null;
  }

  return (
    <div className="w-full h-screen relative">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: 'url("/blackGradient.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
          zIndex: -1, // Keep the background behind the content
        }}
      />
      <div className="flex justify-center items-center p-6">
        <h1 className="text-white relative z-10 text-5xl font-bold font-mac text-center">
          Welcome To Dashboard{" "}
          <br/>
          <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent text-5xl font-leyton">
            {loggedInUser && (loggedInUser.name).toUpperCase()}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default HomeComponent;
