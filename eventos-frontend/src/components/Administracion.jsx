// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function Administracion() {
  return (
    <>
      <div className="container mx-auto px-4">
        <header>
          <AdminNavbar />
        </header>

        <main className="mt-6">
          <Outlet /> {/* Aquí se renderizan los componentes hijos */}
        </main>
      </div>
    </>
  );
};

export default Administracion;