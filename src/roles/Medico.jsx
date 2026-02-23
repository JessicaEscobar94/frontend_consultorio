import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Medico() {
  const [turnos, setTurnos] = useState([]);
  const [turnoActivo, setTurnoActivo] = useState(null);
  const [historias, setHistorias] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');

// CARGAR TURNOS DEL MEDICO

  const cargarTurnos = async () => {
    try {
      const data = await apiFetch('/turnos');
      setTurnos(data);
      if (data.length > 0) setTurnoActivo(data[0]);
    } catch (err) {
      console.error(err.message);
    }
  };

// CARGAR HISTORIAS DEL TURNO

  const cargarHistorias = async (turnoId) => {
    try {
      const data = await apiFetch(`/historias/turno/${turnoId}`);
      setHistorias(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  useEffect(() => {
    if (turnoActivo) {
      cargarHistorias(turnoActivo.id);
    }
  }, [turnoActivo]);

// GUARDAR HISTORIA CLINICA

  const guardarHistoria = async () => {
    if (!descripcion.trim()) {
      setMensaje('❌ La descripción no puede estar vacía');
      return;
    }

    if (!turnoActivo?.id) {
      setMensaje('❌ Turno inválido');
      return;
    }

    try {
      await apiFetch('/historias', {
        method: 'POST',
        body: JSON.stringify({
          turno_id: turnoActivo.id,
          descripcion
        })
      });

      setDescripcion('');
      cargarHistorias(turnoActivo.id);
    } catch (err) {
      setMensaje('❌ ' + err.message);
    }
  };

// ELIMINAR HISTORIA

  const eliminarHistoria = async (id) => {
    if (!window.confirm('¿Eliminar historia clínica?')) return;

    try {
      await apiFetch(`/historias/${id}`, {
        method: 'DELETE'
      });
      cargarHistorias(turnoActivo.id);
    } catch (err) {
      console.error(err.message);
    }
  };

// FILTRO DE TURNOS

  const turnosFiltrados = turnos.filter(t =>
    t.paciente_nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );


// RENDER

  return (
    <div className="medico-layout fade-in">

      <aside className="sidebar">
        <h3>Turnos</h3>

        <input
          className="patient-search"
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        {turnosFiltrados.map(t => (
          <div
            key={t.id}
            className={`patient-item ${turnoActivo?.id === t.id ? 'active' : ''}`}
            onClick={() => setTurnoActivo(t)}
          >
            <strong>{t.paciente_nombre} {t.paciente_apellido}</strong>
            <br />
            <small>{t.fecha} — {t.hora}</small>
          </div>
        ))}

        {turnosFiltrados.length === 0 && (
          <p style={{ fontSize: '13px', marginTop: '10px' }}>
            No se encontraron turnos
          </p>
        )}
      </aside>

      <main className="medico-main">
        {turnoActivo && (
          <>
            <div className="patient-header-full fade-swap">
              <div>
                <h2>{turnoActivo.paciente_nombre} {turnoActivo.paciente_apellido}</h2>
                {turnoActivo.telefono && (
                  <span>📞 {turnoActivo.telefono}</span>
                )}
              </div>

              <div className="patient-meta">
                {turnoActivo.obra_social && (
                  <span>🏥 {turnoActivo.obra_social}</span>
                )}
                <div>
                  📅 {turnoActivo.fecha} — {turnoActivo.hora}
                </div>
              </div>
            </div>

            <div className="history-list">
              <h3>Historias clínicas</h3>

              {historias.length === 0 && (
                <p>No hay historias clínicas previas</p>
              )}

              {historias.map(h => (
                <div key={h.id} className="history-item">
                  <strong>{h.fecha}</strong>
                  <p>{h.descripcion}</p>

                  <button
                    className="button-medical-danger"
                    onClick={() => eliminarHistoria(h.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div className="history-editor">
              <h3>Nueva historia clínica</h3>

              <textarea
                placeholder="Ingrese diagnóstico y observaciones..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />

              <div className="history-actions">
                <button
                  className="button-medical"
                  onClick={guardarHistoria}
                >
                  Guardar historia
                </button>
              </div>

              {mensaje && <p>{mensaje}</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}