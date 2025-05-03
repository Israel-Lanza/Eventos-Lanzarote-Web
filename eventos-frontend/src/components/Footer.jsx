import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="text-gray-800 pt-16 pb-8 mt-4">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-2">{t("footer.publish")}</h2>
                <p className="text-gray-700 mb-4">
                {t("footer.register_or_write")} <a href="mailto:info@eventoslanzarote.es" className="text-blue-600 underline">info@eventoslanzarote.es</a>
                </p>
                
                <Link
                    to="/register"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition"
                >
                    {t('signup')}
                </Link>

                <div className="mt-16 border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                    <div className="mb-4 md:mb-0 font-semibold text-lg">
                        Eventos Lanzarote
                    </div>

                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <Link to="/" className="hover:text-blue-600">{t('menu.home')}</Link>
                        <Link to="/about" className="hover:text-blue-600">{t('about_us')}</Link>
                    </div>

                    <div className="text-xs">&copy; 2025 eventoslanzarote.es. {t("footer.rights")}.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
