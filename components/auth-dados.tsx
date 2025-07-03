"use client";
import { useSession } from 'next-auth/react';
import UserInfo from "./UserInfo";

export default function AuthDados({ session }: any) {
  return (
    <UserInfo user={session?.user}/>
  )
}
