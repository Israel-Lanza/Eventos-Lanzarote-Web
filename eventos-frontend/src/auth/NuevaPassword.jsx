import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Auth from "./Auth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from 'react-i18next';

const NuevaPassword = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await api.post("/password/reset", {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success(response.data.message || "Contraseña restablecida correctamente.");
            navigate("/login");
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
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Nueva Contraseña</h2>

            <form onSubmit={handleSubmit}>
                {/* Contraseña */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-semibold mb-1">Nueva Contraseña</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                        }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-600 hover:text-indigo-600 focus:outline-none"
                    >
                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirmar Contraseña */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-semibold mb-1">Confirmar Contraseña</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.password_confirmation ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                        }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-600 hover:text-indigo-600 focus:outline-none"
                    >
                        {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                    {errors.password_confirmation && (
                        <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>
                    )}
                </div>

                {errors.general && <p className="text-center text-sm text-red-600 mb-4">{errors.general}</p>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Guardar
                </button>
            </form>
        </Auth>
    );
};

export default NuevaPassword;
