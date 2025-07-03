"use client";
import { useSession } from 'next-auth/react';
import UserInfo from "./UserInfo";

// eslint-disable-next-line @next/next/no-async-client-component
export default function AuthDados({ session }: any) {
  // console.log(userId)  
  return (
    <UserInfo user={session?.user}/>
  )
}
