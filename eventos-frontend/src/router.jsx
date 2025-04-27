import { BrowserRouter, Routes, Route } from "react-router-dom";

//Layout principal (Header + Footer + Outlet)
import Principal from "./components/Principal";

//Páginas públicas
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Categoria from './pages/Categoria';
import Descripcion from "./pages/Descripcion";
import Buscar from "./pages/Buscador";

//Autenticación
import Login from "./auth/Login";
import PasswordReset from "./auth/PasswordReset";
import Register from "./auth/Register";

//Dashboard y componentes protegidos
import AdminDashboard from "./pages/Dashboard";
import ListadoEventos from "./components/ListadoEventos";
import ListadoEmpresas from "./components/ListadoEmpresas";
import RutasProtegidas from "./components/RutasProtegidas";

//Para rutas mp definidas
import Error404 from "./pages/Error404";

//Para rutas no definidas dentro del dashboard
import Error404Dashboard from "./pages/Error404Dashboard";
import NuevaPassword from "./auth/NuevaPassword";
import Settings from "./components/Settings";

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas con layout principal */}
                <Route path="/" element={<Principal />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<About />} />
                    <Route path="eventos/categoria/:nombreCategoria" element={<Categoria/>}/>
                    <Route path="categoria/:nombreCategoria" element={<Categoria />} />
                    <Route path="eventos/:nombreEvento" element={<Descripcion/>}/>
                    <Route path="/buscar" element={<Buscar />} />
                </Route>
                {/* Ruta de Auth */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<PasswordReset />} />
                <Route path="/reset-password" element={<NuevaPassword />} />

                {/* Rutas protegidas para el dashboard */}
                <Route path="/dashboard/*" element={<RutasProtegidas><AdminDashboard /></RutasProtegidas>}>
                    <Route index element={<ListadoEventos />} />
                    <Route path="empresas" element={<ListadoEmpresas />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Error404Dashboard />} />
                </Route>

                {/* Para rutas no definidas */}
                <Route path="*" element={<Error404 />} />

            </Routes>
        </BrowserRouter>
    );
}