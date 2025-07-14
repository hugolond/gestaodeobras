"use client";

import Sidebar from "../app/admin/sidebar";
type linkProps = {
  children: React.ReactNode;
  session: any;
};
export default function DefautPage(props: linkProps) {
  return (
      <div className="grid grid-cols-3 sm:grid-cols-4 px-4 sm:pt-4 pt-12 sm:ml-80 gap-4 items-start justify-items-start">
        <Sidebar session={props.session}/> 
            {props.children}
    </div>
  );
}
