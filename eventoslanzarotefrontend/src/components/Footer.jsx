import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <footer className="bg-gray-100 text-center text-gray-700 py-8">
                <div className="container mx-auto px-4">
                    <section className="mt-5">
                        <div className="flex justify-center space-x-12 pt-5">
                            <div>
                                <h6 className="text-lg font-bold uppercase hover:text-gray-900">
                                    <Link to="/">Inicio</Link>
                                </h6>
                            </div>

                            <div>
                                <h6 className="text-lg font-bold uppercase hover:text-gray-900">
                                    <Link to="/eventos">Eventos</Link>
                                </h6>
                            </div>

                            <div>
                                <h6 className="text-lg font-bold uppercase hover:text-gray-900">
                                    <Link to="/about">Sobre Nosotros</Link>
                                </h6>
                            </div>
                        </div>
                    </section>

                    <hr className="my-5 border-gray-300" />

                    <section className="mb-4">
                        <div className="flex justify-center">
                            <div className="w-full max-w-3xl text-center">
                                NEWSLETTER COMPONENT
                            </div>
                        </div>
                    </section>
                </div>

                <div className="text-center py-4 text-sm text-gray-600 bg-gray-200">
                    © 2025 eventoslanzarote.es. Todos los derechos reservados.
                </div>
            </footer>
        </>
    );
};

export default Footer;