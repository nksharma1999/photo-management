import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="main-area">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}