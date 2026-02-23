import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Secretaria() {
  const [turnos, setTurnos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [turnoCancelar, setTurnoCancelar] = useState(null);
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    apiFetch('/horarios')
      .then(setHorarios)
      .catch(() => setHorarios([]));
  }, []);

  // CARGA INICIAL

  useEffect(() => {
    cargarTurnos();
    cargarMedicos();
  }, []);

  const cargarTurnos = async () => {
    const data = await apiFetch('/turnos');
    setTurnos(data.filter(t => t.estado === 'ACTIVO'));
  };

  const cargarMedicos = async () => {
    const data = await apiFetch('/medicos');
    setMedicos(data);
  };

  // CANCELAR TURNO

  const cancelarTurno = async () => {
    try {
      await apiFetch(`/turnos/${turnoCancelar.id}/cancelar`, {
        method: 'PUT'
      });

      setTurnoCancelar(null);
      cargarTurnos();

    } catch (err) {
      alert(err.message);
    }
  };

  //AGRUPAR POR MEDICO

  const turnosPorMedico = turnos.reduce((acc, t) => {
    acc[t.medico] = acc[t.medico] || [];
    acc[t.medico].push(t);
    return acc;
  }, {});

  return (
    <div className="medico-layout fade-in">

      <aside className="sidebar">
        <h3>Agenda</h3>

        <button
          className="button-medical"
          onClick={() => setMostrarModal(true)}
        >
          + Nuevo turno
        </button>
      </aside>

      <main className="medico-main">
        <div className="history-list">
          {Object.keys(turnosPorMedico).map(medico => (
            <div key={medico} className="agenda-medico">
              <h4>🩺 {medico}</h4>

              {turnosPorMedico[medico].map(turno => (
                <div key={turno.id} className="history-item agenda-item">
                  <div className="agenda-hora">
                    {turno.fecha}<br />
                    {turno.hora}
                  </div>

                  <div className="agenda-info">
                    <strong>
                      {turno.paciente_nombre} {turno.paciente_apellido}
                    </strong>

                    <div>📞 {turno.telefono || '-'}</div>
                    <div>🏥 {turno.obra_social || '-'}</div>
                  </div>

                  <button
                    className="button-medical-danger"
                    onClick={() => setTurnoCancelar(turno)}
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {mostrarModal && (
        <ModalNuevoTurno
          medicos={medicos}
          horarios={horarios}
          onClose={() => setMostrarModal(false)}
          onSave={() => {
            setMostrarModal(false);
            cargarTurnos();
          }}
        />
      )}

      {turnoCancelar && (
        <ModalConfirmar
          texto={`¿Cancelar turno de ${turnoCancelar.paciente_nombre}?`}
          onConfirm={cancelarTurno}
          onCancel={() => setTurnoCancelar(null)}
        />
      )}
    </div>
  );
}

// MODALES

function ModalConfirmar({ texto, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{texto}</p>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onCancel}>No</button>
          <button className="button-medical-danger" onClick={onConfirm}>Sí</button>
        </div>
      </div>
    </div>
  );
}
function ModalNuevoTurno({ medicos, horarios, onClose, onSave }) {
  const [form, setForm] = useState({
    medico_id: '',
    dni: '',
    paciente_id: null,
    paciente_nombre: '',
    paciente_apellido: '',
    telefono: '',
    obra_social: '',
    fecha: '',
    hora: ''
  });

  const [horariosOcupados, setHorariosOcupados] = useState([]);

  // BUSCAR PACIENTE POR DNI

  useEffect(() => {
    if (form.dni.length < 7) return;

    apiFetch(`/pacientes/por-dni/${form.dni}`)
      .then(p => {
        if (!p) return;

        setForm(f => ({
          ...f,
          paciente_id: p.id,
          paciente_nombre: p.nombre,
          paciente_apellido: p.apellido,
          telefono: p.telefono || '',
          obra_social: p.obra_social || ''
        }));
      })
      .catch(() => { });
  }, [form.dni]);

  // HORARIOS OCUPADOS

  useEffect(() => {
    if (!form.medico_id || !form.fecha) {
      setHorariosOcupados([]);
      return;
    }

    apiFetch(
      `/turnos-ocupados?medico_id=${form.medico_id}&fecha=${form.fecha}`
    )
      .then(setHorariosOcupados)
      .catch(() => setHorariosOcupados([]));
  }, [form.medico_id, form.fecha]);

  const guardar = async () => {
    await apiFetch('/turnos', {
      method: 'POST',
      body: JSON.stringify({
        medico_id: Number(form.medico_id),
        paciente_id: form.paciente_id || null,
        dni: form.dni,
        nombre: form.paciente_nombre,
        apellido: form.paciente_apellido,
        telefono: form.telefono,
        obra_social: form.obra_social,
        fecha: form.fecha,
        hora: form.hora
      })
    });

    onSave();
  };
  const primeraMayuscula = (texto = '') =>
  texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Nuevo turno</h3>

        <select
          value={form.medico_id}
          onChange={e => setForm({ ...form, medico_id: e.target.value })}
        >
          <option value="">Seleccionar médico</option>
          {medicos.map(m => (
            <option key={m.id} value={m.id}>
              Dr/a. {m.nombre} {m.apellido}
            </option>
          ))}
        </select>

        <input
          placeholder="DNI del paciente"
          value={form.dni}
          onChange={e => setForm({ ...form, dni: e.target.value })}
        />

        <input
          placeholder="Nombre"
          value={form.paciente_nombre}
          onChange={e => setForm({ ...form, paciente_nombre: primeraMayuscula(e.target.value) })}
        />

        <input
          placeholder="Apellido"
          value={form.paciente_apellido}
          onChange={e => setForm({ ...form, paciente_apellido: primeraMayuscula(e.target.value) })}
        />

        <input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          placeholder="Obra social"
          value={form.obra_social}
          onChange={e => setForm({ ...form, obra_social: e.target.value.toUpperCase() })}
        />

        <input
          type="date"
          value={form.fecha}
          onChange={e => setForm({ ...form, fecha: e.target.value })}
        />

        <select
          value={form.hora}
          onChange={e => setForm({ ...form, hora: e.target.value })}
        >
          <option value="">Seleccionar horario</option>
          {horarios
            .filter(h => !horariosOcupados.includes(h))
            .map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
        </select>

        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="button-medical"
            onClick={guardar}
            disabled={
              !form.medico_id ||
              !form.dni ||
              !form.paciente_nombre ||
              !form.paciente_apellido ||
              !form.fecha ||
              !form.hora
            }
          >
            Guardar turno
          </button>
        </div>
      </div>
    </div>
  );
}