
import teguiseImg from '../assets/teguise.jpg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const Auth = ({ children }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 h-full">
                <img
                    src={teguiseImg}
                    alt="Paisaje de Teguise"
                    className="w-full h-full object-cover object-top"
                />
            </div>
            <div className="flex flex-col justify-center items-center md:w-1/2 p-8 bg-white h-full">
                <div className="w-full max-w-md">
                    {children}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            ← {t('go_back')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;