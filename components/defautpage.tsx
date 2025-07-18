"use client";

import Sidebar from "../app/admin/sidebar";
type linkProps = {
  children: React.ReactNode;
  session: any;
};
export default function DefautPage(props: linkProps) {
  return (
      <div className="grid grid-cols-3 px-4 pt-12 sm:grid-cols-4 sm:pt-4 sm:ml-80 gap-4">
        <Sidebar session={props.session}/> 
            {props.children}
    </div>
  );
}
