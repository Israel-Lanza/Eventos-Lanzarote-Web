// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Principal = () => {
  return (
    <div className="container">
      <header className="mb-5">
        <Header />
      </header>

      <main >
        <Outlet /> {/* Aquí se renderizan los componentes hijos */}
      </main>

      <Footer />
    </div>
  );
};

export default Principal;