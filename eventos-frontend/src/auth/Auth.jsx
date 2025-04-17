
import { Outlet } from "react-router-dom";

const Auth = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://hips.hearstapps.com/hmg-prod/images/carretera-de-lanzarote-parque-timanfaya-canarias-1621531417.jpg?crop=1.00xw:1.00xh;0,0&resize=1024:*')" }} />
            <div className="flex flex-col justify-center items-center md:w-1/2 p-8 bg-white">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Auth;