"use client";
import React, { use } from "react";
import Image from "next/image";
import ReactLogo from "../app/assets/avatar4.svg";
import packageJson from '../package.json';

interface UserInfoProps{
    user:{
        username?: string | null
        email?: string | null
        version?: string | null 
    } | undefined
}

export default function UserInfo({user}: UserInfoProps){
  const versao = packageJson.version
  
    return (
        <div className="topcolor flex bottom-0 left-0 z-20 p-2 rounded-[0px_0px_16px_16px]">
            <Image className="w-[65px] px-1.5" priority src={ReactLogo} alt="Login" />
            <div className="flex items-center justify-center border-x-[#aaaaaa] border-x-2">
            </div>
            <div className="flex-wrap max-w-[10rem] px-2">
              <div className="textDados font-extrabold flex-item leading-[var(--h4-14-20-line-height)] [font-style:var(--h4-14-20-font-style)]">
                {user?.username}
              </div>
              <a
                className="textDados text-[0.7rem] break-words"
                rel="noopener noreferrer"
                target="_blank"
              >
                <p>{user?.email}</p>
              </a>
              <a
                className="textDados flex-item text-[0.7rem]"
                rel="noopener noreferrer"
                target="_blank"
              >
                <p>v.{versao}</p>
              </a>
            </div>
          </div>
    )
}