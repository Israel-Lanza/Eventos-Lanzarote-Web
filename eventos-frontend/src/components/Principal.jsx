import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Principal = () => {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="w-full max-w-6xl px-4">
        
        <header className="mb-5">
          <Header />
        </header>

        <main>
          <Outlet /> 
        </main>
        
        <hr className="mt-5"/>
        <Footer />
      </div>
    </div>
  );
};

export default Principal;