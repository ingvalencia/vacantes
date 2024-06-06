import React from 'react';

function Navbar() {
  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <button id="menuButton" className="openbtn" onClick={openNav} style={{ display: 'none' }}>☰ Menu</button>
      <span className="navbar-brand"><h1>Vacantes Administrativas</h1></span>
      <button className="btn btn-salir ml-auto" id="salir-btn">Salir</button>
    </nav>
  );
}

export default Navbar;
