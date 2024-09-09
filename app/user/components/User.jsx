'use client'
import React from "react";
import { useGetUserQuery } from "../../../redux/authenticationApi";

const User = () => {
  const {data} = useGetUserQuery();

  console.log("data", data);
  return <div>User</div>;
};

export default User;
