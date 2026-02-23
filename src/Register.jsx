import { useState } from 'react';
import { apiFetch } from './api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register({ volver }) {
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    obra_social: '',
    password: '',
    confirm: ''
  });

  const [ver, setVer] = useState(false);
  const [verConfirm, setVerConfirm] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;

    // validaciones
    if (['dni', 'telefono'].includes(name) && !/^\d*$/.test(value)) return;
    if (['nombre', 'apellido'].includes(name) && !/^[a-zA-Z\s]*$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const registrar = async () => {
    setError('');
    setOk('');

    if (form.password !== form.confirm) {
      return setError('Las contraseñas no coinciden');
    }

    if (!form.dni || !form.nombre || !form.apellido || !form.password) {
      return setError('Complete todos los campos obligatorios');
    }

    try {
      await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({
          usuario: form.dni,
          nombre: form.nombre,
          apellido: form.apellido,
          password: form.password,
          obra_social: form.obra_social,
          telefono: form.telefono
        })
      });

      setOk('✅ Paciente registrado correctamente');
      setForm({
        dni: '',
        nombre: '',
        apellido: '',
        telefono: '',
        obra_social: '',
        password: '',
        confirm: ''
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Registro de Paciente</h2>

      {error && <p className="error-text">{error}</p>}
      {ok && <p className="ok-text">{ok}</p>}

      <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      <input name="obra_social" placeholder="Obra Social" value={form.obra_social} onChange={handleChange} />

      <div className="password-wrapper">
        <input
          type={ver ? 'text' : 'password'}
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <span className="password-toggle"
          onClick={() => setVer(!ver)}>
          {ver ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

      <div className="password-wrapper">
        <input
          type={verConfirm ? 'text' : 'password'}
          name="confirm"
          placeholder="Confirmar contraseña"
          value={form.confirm}
          onChange={handleChange}
        />
        <span
          className="password-toggle"
          onClick={() => setVerConfirm(!verConfirm)}
        >
          {verConfirm ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>


      <button onClick={registrar}>
        Registrarse
      </button>

      <button className="button-secondary" onClick={volver}>
        Volver
      </button>
    </div>
  );
}
