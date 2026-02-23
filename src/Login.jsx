import { useState } from 'react';
import { apiFetch } from './api';
import Register from './Register';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [ver, setVer] = useState(false);
  const [error, setError] = useState('');
  const [mostrarRegister, setMostrarRegister] = useState(false);

  const ingresar = async () => {
    setError('');

    if (!usuario || !password) {
      return setError('Complete usuario y contraseña');
    }

    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ usuario, password })
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('nombre', `${data.nombre} ${data.apellido}`);
      localStorage.setItem('userId', data.id);

      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (mostrarRegister) {
    return <Register volver={() => setMostrarRegister(false)} />;
  }

  return (
    <div className="container fade-in">
      <h2>Ingreso al sistema</h2>

      {error && <p className="error-text">{error}</p>}

      <input
        placeholder="Usuario / DNI"
        value={usuario}
        onChange={e => setUsuario(e.target.value.toLowerCase())}
      />

      <div className="password-wrapper">
        <input
          type={ver ? 'text' : 'password'}
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <span className="password-toggle"
          onClick={() => setVer(!ver)}>
          {ver ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

      <button onClick={ingresar}>
        Ingresar
      </button>

      <hr />

      <p style={{ textAlign: 'center' }}>
        ¿Sos paciente nuevo?
      </p>

      <button
        className="button-secondary"
        onClick={() => setMostrarRegister(true)}
      >
        Registrarse
      </button>
    </div>
  );
}