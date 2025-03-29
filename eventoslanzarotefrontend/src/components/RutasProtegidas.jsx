import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const RutasProtegidas = ({ children, roleRequired = null }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setChecking(false);
  }, []);

  if (checking) return <div>Cargando...</div>;

  if(!user){
    return <Navigate to="/login" replace />;
  }

  if(roleRequired && !user.roles.includes(roleRequired)){
    if (user.roles.includes("admin")) {
        return <Navigate to="/dashboard" replace />;//Redirigir a su dashboard de admin
    }else if (user.roles.includes("empresa")) {
        return <Navigate to="/dashboard/eventos" replace />;//Redirigir al dashboard de empresa
    }else {
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RutasProtegidas;
