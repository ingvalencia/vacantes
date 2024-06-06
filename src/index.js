import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot correctamente
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
