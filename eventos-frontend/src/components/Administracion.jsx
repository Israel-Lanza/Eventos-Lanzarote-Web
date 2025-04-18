// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function Administracion() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full shadow-sm bg-white sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminNavbar />
        </div>
      </header>

      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Administracion;