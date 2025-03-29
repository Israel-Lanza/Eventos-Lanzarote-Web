import { Link } from "react-router-dom";
import { Music4, BookOpen, Palette, Utensils, Smile, Feather, Volleyball } from 'lucide-react';
import FestivalIcon from '@mui/icons-material/Festival';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

const NavCategoria = () => {
    const categorias = [
        { nombre: 'Musicales', icon: Music4, link: 'eventos/categoria/musicales' },
        { nombre: 'Talleres, cursos y conferencias', icon: BookOpen, link: 'eventos/categoria/talleres&cursos&conferencias' },
        { nombre: 'Exposiciones', icon: Palette, link: 'eventos/categoria/exposiciones' },
        { nombre: 'Gastronómicos', icon: Utensils, link: 'eventos/categoria/gastrononicos' },
        { nombre: 'Infantiles', icon: Smile, link: 'eventos/categoria/infantiles' },
        { nombre: 'Tradicionales', icon: Feather, link: 'eventos/categoria/tradicionales' },
        { nombre: 'Ferias, galas y festivales', icon: FestivalIcon, link: 'eventos/categoria/ferias&galas&festivales' },
        { nombre: 'Artes Escénicas', icon: TheaterComedyIcon, link: 'eventos/categoria/artes-escenicas' },
        { nombre: 'Deportivos', icon: Volleyball, link: 'eventos/categoria/deportivos' }
    ];
    
    return (
        <>
            <div className="mx-auto my-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Categorías</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
                    {categorias.map((categoria) => (
                        <Link
                            to={categoria.link}
                            key={categoria.nombre}
                            className="bg-gray-100 rounded-2xl pt-4 pb-2 text-center shadow-sm hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                        >
                            <categoria.icon className="h-7 w-7 mx-auto mb-3" />
                            <p className="font-medium text-sm">{categoria.nombre}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NavCategoria;
