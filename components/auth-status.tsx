import { unstable_getServerSession } from "next-auth/next";
import { BoxText } from "../app/admin/boxText";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { json } from "stream/consumers";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function AuthStatus() {
  const session = await getServerSession(authOptions);
  const textLogin =  `${session?.user?.username} - ${session?.user?.email}`;
  // console.log(userId)  
  return (    
    <div className="sm:hidden w-full flex justify-end px-5 pt-2">
      {session && (        
        <p className="text-gray-500 text-xs">                   
          {textLogin} 
        </p>
      )}
    </div>
  );
}
