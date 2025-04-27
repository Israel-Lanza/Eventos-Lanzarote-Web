import React, { useState } from "react";
import Auth from "./Auth";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { changePassword } from "../services/empresas";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    const handleReset = async (e) => {
        e.preventDefault();
        setErrors({});
    
        try {
            const response = await changePassword(email);
    
            toast.success(response.message || "Correo enviado correctamente.");
            setEmail("");
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                toast.error(t("errors.field"));
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
                toast.error(error.response.data.message);
            } else {
                setErrors({ general: "Error desconocido. Intenta más tarde." });
                toast.error(t("errors.network"));
            }
        }
    };

    return (
        <Auth>
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Recuperar Contraseña</h2>

            <form onSubmit={handleReset}>
                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                            }`}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                {errors.general && <p className="text-center text-sm text-red-600 mb-4">{errors.general}</p>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Enviar
                </button>
            </form>
        </Auth>
    );
};

export default PasswordReset;