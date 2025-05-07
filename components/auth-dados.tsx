import { useSession } from 'next-auth/react';
import UserInfo from "./UserInfo";

// eslint-disable-next-line @next/next/no-async-client-component
export default function AuthDados() {
  const { data: session } = useSession();
  // console.log(userId)  
  return (
    <UserInfo user={session?.user}/>
  )
}
