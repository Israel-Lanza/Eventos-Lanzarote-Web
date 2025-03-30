import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/Principal";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Categoria from './pages/Categoria';
import LoginPage from "./auth/Login";
import AdminDashboard from "./pages/Dashboard";
import ListadoEventos from "./components/ListadoEventos";
import Descripcion from "./pages/Descripcion";
import ListadoEmpresas from "./components/ListadoEmpresas";
import RutasProtegidas from "./components/RutasProtegidas";


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

                <Route path="/dashboard/*" element={<RutasProtegidas><AdminDashboard /></RutasProtegidas>}>
                    <Route index element={<ListadoEventos />} />
                    <Route path="empresas" element={<ListadoEmpresas />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}