import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Vacantes from './components/Vacantes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  useEffect(() => {
    const goSalir = () => {
      let myurl = 'https://diniz.com.mx/';
      window.location.replace(myurl);
    };

    const salirBtn = document.getElementById('salir-btn');
    if (salirBtn) {
      salirBtn.addEventListener('click', goSalir);
    }

    return () => {
      if (salirBtn) {
        salirBtn.removeEventListener('click', goSalir);
      }
    };
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <div className="content">
        <Vacantes />
      </div>
    </div>
  );
}

export default App;
