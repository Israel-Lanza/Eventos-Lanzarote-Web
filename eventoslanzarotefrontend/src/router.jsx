import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/Principal";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Administracion from './components/Administracion';
import Dashboard from './pages/Dashboard';
import Categoria from './pages/Categoria';
import Companies from "./pages/Companies";
import Eventos from "./pages/Eventos";
import LoginPage from "./auth/Login";
import AdminDashboard from "./pages/Dashboard";
import ListadoEventos from "./components/ListadoEventos";
import Descripcion from "./pages/Descripcion";
import ListadoEmpresas from "./components/ListadoEmpresas";


export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Principal />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<About />} />
                    <Route path="eventos/categoria/:nombreCategoria" element={<Categoria/>}/>
                    <Route path="eventos/:nombreEvento" element={<Descripcion/>}/>
                </Route>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/dashboard" element={<AdminDashboard />}>
                    <Route index element={<ListadoEventos />} />
                    <Route path="empresas" element={<ListadoEmpresas />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}