'use client';

import { useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session } = useSession();

  const textLogin = `${session?.user?.username} - ${session?.user?.email}`;

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
