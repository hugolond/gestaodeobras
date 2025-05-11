"use client";
import { Children } from "react";
import Sidebar from "../app/admin/sidebar";
type linkProps = {
  children: React.ReactNode;

};
export default function DefautPage(props: linkProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 px-4 sm:pt-4 pt-12 sm:ml-80 max-w-screen-lg">
        <Sidebar /> 
            {props.children}
      </div>
    </div>
  );
}
