import RightSidebar from "@/components/shared/rightSideBar/RightSideBar";
import LeftSideBar from "@/components/shared/leftSidebar/LeftSideBar";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | QueryHub",
  description:
    " Join QueryHub to get answers to your query from an experienced dev community",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        <RightSidebar />
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
