import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { toast } from "react-hot-toast";

export default function Settings() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        cif: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/user/profile");
                const userData = response.data.user;

                setUser(userData);
                setFormData({
                    nombre: userData.nombre || "",
                    email: userData.email || "",
                    cif: userData.cif || "",
                    password: "",
                    confirmPassword: "",
                });

                localStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
                console.error("Error cargando perfil:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.put("/user/update-profile", {
                nombre: formData.nombre,
                email: formData.email,
                cif: formData.cif,
                password: formData.password || undefined,
            });

            const updatedUser = response.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            toast.success("Datos actualizados correctamente.");
            setFormData((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar los datos.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center text-gray-500">Cargando datos de usuario...</div>;
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Configuración de Cuenta</h2>
                <p className="text-sm text-gray-500">Actualiza tu información personal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    {/* CIF / DNI */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">CIF / DNI</label>
                        <input
                            type="text"
                            name="cif"
                            value={formData.cif}
                            onChange={handleChange}
                            placeholder="CIF / DNI"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nueva contraseña */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Dejar en blanco si no quieres cambiarla"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Confirmar nueva contraseña */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmar nueva contraseña"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Botón guardar */}
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}
