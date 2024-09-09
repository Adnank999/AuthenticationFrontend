import React from 'react'
import { Dashboard } from '../Components/Dashboard'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


const fetchUsers = async () => {

  const cookieStore = cookies();
  
  const token= cookieStore.get('token')?.value;
  const role = cookieStore.get('role')?.value;

//  console.log("token",token);
  
if (!token || !role) {

  redirect('/login');
}

  const rolePrefix = role == 'Admin' ? 'admin' : role === 'Manager' ? 'manager' : role === 'User' ? 'user' : '';


  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}api/${rolePrefix}/getUsers`, {
    method: 'GET',
    headers: {
      'Authorization' : `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });



  if (!res.ok) {
    throw new Error('Failed to fetch users');
    
  }

  const data = await res.json();
  return data;
};

const page = async () => {

  const users = await fetchUsers();

  console.log(users)



  return (
    <Dashboard users={users?.users}/>
    
  )
}

export default page