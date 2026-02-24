import { useState, useEffect } from 'react';
import Login from './Login';
import Paciente from './roles/Paciente';
import Medico from './roles/Medico';
import Secretaria from './roles/Secretaria';
import Header from './Header';
import HeaderInstitucional from './HEaderInstitucional';

function App() {
  const [rol, setRol] = useState(null);
  const [, setPaso] = useState('ROL');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem('rol');
    const nombreGuardado = localStorage.getItem('nombre');

    if (rolGuardado) {
      setRol(rolGuardado);
      setUsuario({ nombre: nombreGuardado });
      setPaso('APP');
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    setRol(null);
    setUsuario(null);
  };

  if (!rol) {
    return (
      <>
        <HeaderInstitucional />
        <Login onLogin={(data) => {
          setRol(data.rol);
          setUsuario({ nombre: data.nombre });
        }} />
      </>
    );
  }

  return (
    <>
      <HeaderInstitucional />
      <Header titulo={usuario.nombre} onBack={cerrarSesion} />

      {rol === 'PACIENTE' && <Paciente />}
      {rol === 'MEDICO' && <Medico />}
      {rol === 'SECRETARIA' && <Secretaria />}
    </>
  );
}
export default App;