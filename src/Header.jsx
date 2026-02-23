export default function Header({ onBack }) {
  const nombre = localStorage.getItem('nombre');
  const apellido = localStorage.getItem('apellido');

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="app-header">

      <div className="app-header-left">
        {onBack && (
          <button className="header-btn" onClick={onBack}>
            ← Volver
          </button>
        )}
      </div>

      <div className="app-header-center">
        {nombre} {apellido}
      </div>

      <div className="app-header-right">
        <button
          className="header-btn danger"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

    </div>
  );
}