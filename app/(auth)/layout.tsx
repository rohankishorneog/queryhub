import React from "react";

interface Layout {
  children: React.ReactNode;
}

const Layout = ({ children }: Layout) => {
  return <div>{children}</div>;
};

export default Layout;
