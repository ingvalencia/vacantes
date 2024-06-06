import React from 'react';

function Sidebar() {
  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
  };

  return (
    <div id="mySidebar" className="sidebar">
      <a className="closebtn" onClick={closeNav}>×</a>
      {/* Aquí puedes agregar tus enlaces de navegación */}
      <a href="/" id="home-link">Inicio</a>
      <a href="/vacantes" id="vacantes-link">Vacantes</a>
      <a href="/ingresos" id="ingresos-link">Ingresos</a>
    </div>
  );
}

export default Sidebar;
