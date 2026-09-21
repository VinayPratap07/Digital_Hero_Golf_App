import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Fixed-width isolated sidebar */}
      <Sidebar />

      {/* Main content scroll area */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
