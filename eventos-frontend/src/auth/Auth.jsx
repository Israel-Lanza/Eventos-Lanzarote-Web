
import teguiseImg from '../assets/teguise.jpg';

const Auth = ({ children }) => {
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
                </div>
            </div>
        </div>
    );
};

export default Auth;