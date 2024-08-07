import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <div className="">left side bar</div>
        <div>{children}</div>
        <div>Right side</div>
      </div>

      {/* toaster */}
    </main>
  );
};

export default Layout;
