import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api';

export default function Paciente() {
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [misTurnos, setMisTurnos] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    apiFetch('/horarios')
      .then(setHorarios)
      .catch(() => setHorarios([]));
  }, []);

  // CARGA MÉDICOS

  useEffect(() => {
    apiFetch('/medicos')
      .then(setMedicos)
      .catch(err => setMensaje(err.message));
  }, []);

  // CARGA MIS TURNOS

  const cargarMisTurnos = async () => {
    try {
      const data = await apiFetch('/mis-turnos');
      setMisTurnos(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    cargarMisTurnos();
  }, []);

  //HORARIOS OCUPADOS
  const cargarHorariosOcupados = useCallback(async () => {
    if (!medicoId || !fecha) {
      setHorariosOcupados([]);
      return;
    }

    try {
      const data = await apiFetch(
        `/turnos-ocupados?medico_id=${medicoId}&fecha=${fecha}`
      );
      setHorariosOcupados(data);
    } catch (err) {
      console.error(err.message);
    }
  }, [medicoId, fecha]);

  useEffect(() => {
    cargarHorariosOcupados();
  }, [cargarHorariosOcupados]);

  //RESERVAR TURNO

  const reservarTurno = async () => {
    try {
      const nombreCompleto = localStorage.getItem('nombre');

      if (!nombreCompleto) {
        setMensaje('❌ No se pudo obtener el nombre del paciente');
        return;
      }

      const partes = nombreCompleto.split(' ');
      const nombre = partes[0];
      const apellido = partes.slice(1).join(' ') || '-';

      await apiFetch('/turnos', {
        method: 'POST',
        body: JSON.stringify({
          medico_id: medicoId,
          fecha,
          hora,
          paciente_nombre: nombre,
          paciente_apellido: apellido,
          telefono: null,
          obra_social: null
        })
      });

      setMensaje('✅ Turno reservado correctamente');
      setHora('');
      await cargarMisTurnos();
      await cargarHorariosOcupados();

    } catch (err) {
      setMensaje('❌ ' + err.message);
    }
  };

  //CANCELAR TURNO

  const cancelarTurno = async (idTurno) => {
    try {
      await apiFetch(`/turnos/${idTurno}/cancelar`, {
        method: 'PUT'
      });

      setMensaje('❌ Turno cancelado');

      await cargarMisTurnos();
      await cargarHorariosOcupados();

    } catch (err) {
      setMensaje('❌ ' + err.message);
    }
  };

  //RENDER

  return (
    <div className="container fade-in">

      <h2>Sacar turno</h2>

      <label>Médico</label>
      <select
        value={medicoId}
        onChange={e => setMedicoId(e.target.value)}
      >
        <option value="">Seleccione médico</option>
        {medicos.map(m => (
          <option key={m.id} value={m.id}>
            Dr/a. {m.nombre} {m.apellido}
          </option>
        ))}
      </select>

      <label>Fecha</label>
      <input
        type="date"
        value={fecha}
        min={new Date().toISOString().split('T')[0]}
        onChange={e => setFecha(e.target.value)}
      />

      <label>Horario</label>
      <select
        value={hora}
        onChange={e => setHora(e.target.value)}
      >
        <option value="">Seleccione horario</option>
        {horarios.map(h => (
          <option
            key={h}
            value={h}
            disabled={horariosOcupados.includes(h)}
          >
            {h}
          </option>
        ))}
      </select>

      <button
        onClick={reservarTurno}
        disabled={!medicoId || !fecha || !hora}
      >
        Reservar turno
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <hr />

      <h3>Mis turnos</h3>

      {misTurnos.length === 0 && <p>No tenés turnos asignados</p>}

      <ul className="turnos-list">
        {misTurnos.map(turno => (
          <li key={turno.id} className="turno-item">
            <div>
              📅 {turno.fecha} — {turno.hora}<br />
              Dr/a. {turno.medico_nombre} {turno.medico_apellido}<br />
              Estado: {turno.estado}
            </div>

            {turno.estado === 'ACTIVO' && (
              <button
                className="button-danger"
                onClick={() => cancelarTurno(turno.id)}
              >
                Cancelar
              </button>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}