import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Vacantes.css';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FaFileExcel } from 'react-icons/fa';

function Vacantes() {
    const [vacantes, setVacantes] = useState([]);
    const [filteredVacantes, setFilteredVacantes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [analistas, setAnalistas] = useState([]);
    const [comentarios, setComentarios] = useState('');
    const [comentariosFijos, setComentariosFijos] = useState('');
    const [vacanteId, setVacanteId] = useState('');
    const [areaId, setAreaId] = useState('');
    const [analistaId, setAnalistaId] = useState('');
    const [analistaNombre, setAnalistaNombre] = useState('');
    const [sueldo, setSueldo] = useState('');
    const [estatusId, setEstatusId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [jefes, setJefes] = useState([]);
    const [jefeId, setJefesId] = useState('');
    const [jefeNombre, setJefeNombre] = useState('');
    const [fechaRequisicion, setFechaRequisicion] = useState('');
    const [fechaSeleccion, setFechaSeleccion] = useState(''); // Nuevo estado para la fecha de requisición
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [selectedVacante, setSelectedVacante] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [nombre, setNombre] = useState('');
    const [noempl, setNoempl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [shouldFilter, setShouldFilter] = useState(true); // Nuevo estado

    const itemsPerPage = 10;

    const getQueryVariable = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return false;
    };

    useEffect(() => {
        const quer = getQueryVariable('id');
        //const quer = '66638a0207a53';
        console.log("Query variable 'id':", quer); // Depuración
        if (quer !== false) {
            usuario_con(quer);
        } else {
            console.log("No se encontró el parámetro 'id'");
        }
    }, []);

    const usuario_con = (numero) => {
        let data = {
            sesionid: numero
        };
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        };
        console.log("Request info:", requestInfo); // Depuración
        fetch('https://diniz.com.mx/diniz/servicios/services/pn_sesion_con2.php', requestInfo)
            .then(response => response.json())
            .then(DatosUsuario => {
                console.log("DatosUsuario:", DatosUsuario); // Depuración
                if (DatosUsuario[0].usuarios.noempl !== 'x') {
                    const noempl = DatosUsuario[0].usuarios.noempl;
                    const puesto = DatosUsuario[0].usuarios.puesto; // Obtener puesto
                    setNombre(DatosUsuario[0].usuarios.nombre);
                    setNoempl(noempl);
                    if (puesto === '' || puesto !== 'ANALISTA DE ATRACCION DE TALENTO') {
                        // No filtrar vacantes
                        setShouldFilter(false);
                    } else {
                        // Filtrar vacantes por noempl
                        setShouldFilter(true);
                    }
                    fetchVacantesData(); // Llamar a fetchVacantesData después de definir el filtro
                } else {
                    //window.location.replace('https://diniz.com.mx');
                }
            })
            .catch(e => console.log("Error:", e));
    };

    const fetchVacantesData = () => {
        fetch('https://diniz.com.mx/diniz/servicios/services/consulta_vacantes.php')
            .then(response => response.json())
            .then(data => {
                setVacantes(data);
                if (shouldFilter) {
                    setFilteredVacantes(data.filter(vacante => vacante.noempl === noempl)); // Filtrar vacantes por noempl
                } else {
                    setFilteredVacantes(data); // No filtrar, mostrar todas las vacantes
                }
            })
            .catch(error => {
                console.error('Error fetching vacantes:', error);
            });
    };

    const fetchCatalogData = () => {
        fetch('https://diniz.com.mx/diniz/servicios/services/consulta_cat_vacantes.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    console.error(data.error);
                } else {
                    setVacantes(data.vacantes);
                    setAreas(data.areas);
                    setEstatus(data.estatus);
                    setTipo(data.tipo);
                    setAnalistas(data.analistas);
                    setJefes(data.jefes);
                }
            })
            .catch(error => {
                setError('Error fetching data: ' + error.message);
                console.error('Error fetching data: ', error);
            });
    };

    useEffect(() => {
        fetchCatalogData();
    }, []);

    useEffect(() => {
        if (analistas.length > 0 && noempl) {
            const analista = analistas.find(a => a.noempl === noempl);
            if (analista) {
                setAnalistaId(analista.id);
                setAnalistaNombre(analista.nombre);
            }
        }
    }, [analistas, noempl]);

    useEffect(() => {
        const selectedJefe = jefes.find(jefe => jefe.id === jefeId);
        if (selectedJefe) {
            setJefeNombre(selectedJefe.nombre_completo);
        } else {
            setJefeNombre('');
        }
    }, [jefeId, jefes]);
    
    useEffect(() => {
        if (noempl && vacantes.length > 0) {
            if (shouldFilter) {
                filterVacantesByNoempl(noempl);
            } else {
                setFilteredVacantes(vacantes);
            }
        }
    }, [noempl, vacantes, shouldFilter]);

    const filterVacantesByNoempl = (noempl) => {
        const filtered = vacantes.filter(vacante => vacante.noempl === noempl);
        setFilteredVacantes(filtered);
    };

    const filterVacantesBySearchTerm = (term) => {
        if (term === '') {
            if (shouldFilter) {
                filterVacantesByNoempl(noempl);
            } else {
                setFilteredVacantes(vacantes);
            }
        } else {
            const filtered = vacantes.filter(vacante =>
                (shouldFilter ? vacante.noempl === noempl : true) && (
                vacante.nom_vacante.toLowerCase().includes(term.toLowerCase()) ||
                vacante.nom_area.toLowerCase().includes(term.toLowerCase()) ||
                vacante.analista.toLowerCase().includes(term.toLowerCase()) ||
                vacante.nom_estatus.toLowerCase().includes(term.toLowerCase()) ||
                vacante.nom_tipo.toLowerCase().includes(term.toLowerCase()) ||
                vacante.nom_jefe_directo.toLowerCase().includes(term.toLowerCase()) ||
                vacante.comentario.toLowerCase().includes(term.toLowerCase()))
            );
            setFilteredVacantes(filtered);
        }
    };

    const filterVacantesByDates = (start, end) => {
        if (!start || !end) {
            if (shouldFilter) {
                filterVacantesByNoempl(noempl);
            } else {
                setFilteredVacantes(vacantes);
            }
            return;
        }
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const filtered = vacantes.filter(vacante => {
            const vacanteDate = new Date(vacante.fecha_registro);
            return vacanteDate >= startDateObj && vacanteDate <= endDateObj;
        }).filter(vacante => shouldFilter ? vacante.noempl === noempl : true);
        setFilteredVacantes(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        filterVacantesBySearchTerm(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        filterVacantesByDates(event.target.value, endDate);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        filterVacantesByDates(startDate, event.target.value);
    };

    const clearDateFilters = () => {
        setStartDate('');
        setEndDate('');
        if (shouldFilter) {
            filterVacantesByNoempl(noempl);
        } else {
            setFilteredVacantes(vacantes);
        }
    };

    const clearSearchTerm = () => {
        setSearchTerm('');
        if (shouldFilter) {
            filterVacantesByNoempl(noempl);
        } else {
            setFilteredVacantes(vacantes);
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const resetForm = () => {
        setVacanteId('');
        setAreaId('');
        setAnalistaId('');
        setAnalistaNombre('');
        setSueldo('');
        setEstatusId('');
        setTipoId('');
        setJefesId('');
        setJefeNombre('');
        setFechaRequisicion(''); // Resetear fecha de requisición
        setFechaSeleccion('');
        setFechaIngreso('');
        setComentarios('');
        setComentariosFijos('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!vacanteId || !areaId || !analistaId || !sueldo || !estatusId || !tipoId || !jefeId || !fechaRequisicion || !fechaIngreso || !fechaSeleccion || !comentarios) {
            let missingFields = [];
            if (!vacanteId) missingFields.push('Vacante');
            if (!areaId) missingFields.push('CEF/Área');
            if (!analistaId) missingFields.push('Analista');
            if (!sueldo) missingFields.push('Sueldo');
            if (!estatusId) missingFields.push('Estatus');
            if (!tipoId) missingFields.push('Tipo');
            if (!jefeId) missingFields.push('Jefe Directo');
            if (!fechaRequisicion) missingFields.push('Fecha de Requisición');
            if (!fechaSeleccion) missingFields.push('Fecha de Selección');
            if (!fechaIngreso) missingFields.push('Fecha de Ingreso');
            if (!comentarios) missingFields.push('Comentarios');

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`,
            });
            return;
        }

        const data = {
            vacante_id: vacanteId,
            area_id: areaId,
            analista: analistaNombre,
            noempl: noempl,
            sueldo: sueldo.replace(/,/g, ''),
            estatus_id: estatusId,
            tipo_id: tipoId,
            jefe: jefeNombre,
            fecha_requisicion: fechaRequisicion, // Añadir fecha de requisición al objeto de datos
            fecha_seleccion: fechaSeleccion,
            fecha_ingreso: fechaIngreso,
            comentario: comentarios,
        };

        fetch('https://diniz.com.mx/diniz/servicios/services/agregar_vacantes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: data.message,
                    });
                    resetForm();
                    setShowModal(false);
                    setShowTable(true);
                    fetchVacantesData();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al enviar los datos',
                });
                console.error('Error:', error);
            });
    };

    const handleEdit = (vacante) => {
        setSelectedVacante(vacante);
        setVacanteId(vacante.id);
        setAreaId(vacante.area_id);
        setAnalistaId(vacante.analista_id);
        setAnalistaNombre(vacante.analista);
        setSueldo(vacante.sueldo);
        setEstatusId(vacante.estatus_id);
        setTipoId(vacante.tipo_id);
        setJefesId(vacante.jefe_id);
        setJefeNombre(vacante.nom_jefe_directo);
        setFechaRequisicion(vacante.fecha_requisicion); // Añadir fecha de requisición al formulario de edición
        setFechaSeleccion(vacante.fecha_seleccion);
        setFechaIngreso(vacante.fecha_ingreso);
        setComentarios(vacante.comentario);
        setComentariosFijos(vacante.comentario); // Set the fixed part of the comment
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();

        if (!vacanteId || !areaId || !sueldo || !estatusId || !tipoId || !jefeId || !fechaRequisicion || !fechaSeleccion || !fechaIngreso || !comentarios) {
            let missingFields = [];
            if (!vacanteId) missingFields.push('Vacante');
            if (!areaId) missingFields.push('CEF/Área');
            if (!sueldo) missingFields.push('Sueldo');
            if (!estatusId) missingFields.push('Estatus');
            if (!tipoId) missingFields.push('Tipo');
            if (!jefeId) missingFields.push('Jefe Directo');
            if (!fechaRequisicion) missingFields.push('Fecha de Requisición');
            if (!fechaSeleccion) missingFields.push('Fecha de Selección');
            if (!fechaIngreso) missingFields.push('Fecha de Ingreso');
            if (!comentarios) missingFields.push('Comentarios');

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`,
            });
            return;
        }

        const data = {
            id: selectedVacante.id,
            vacante_id: vacanteId,
            area_id: areaId,
            analista: analistaNombre,
            noempl: noempl,
            sueldo: sueldo.replace(/,/g, ''),
            estatus_id: estatusId,
            tipo_id: tipoId,
            jefe: jefeNombre,
            fecha_requisicion: fechaRequisicion, // Añadir fecha de requisición al objeto de datos
            fecha_seleccion: fechaSeleccion,
            fecha_ingreso: fechaIngreso,
            comentario: comentarios,
        };

        fetch('https://diniz.com.mx/diniz/servicios/services/actualiza_vacante.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: data.message,
                    });
                    resetForm();
                    setShowEditModal(false);
                    fetchVacantesData();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al enviar los datos',
                });
                console.error('Error:', error);
            });
    };

    const handleAnalistaChange = (event) => {
        const selectedAnalista = analistas.find(analista => analista.id === event.target.value);
        if (selectedAnalista) {
            const currentDate = new Date().toLocaleDateString();
            const fixedText = `${selectedAnalista.nombre} - ${currentDate}`;
            setComentariosFijos(fixedText);
            setComentarios(fixedText);
            setAnalistaId(selectedAnalista.id);
            setAnalistaNombre(selectedAnalista.nombre);
        } else {
            setComentariosFijos('');
            setComentarios('');
            setAnalistaId('');
            setAnalistaNombre('');
        }
    };

    const handleComentariosChange = (event) => {
        const inputText = event.target.value;
        if (inputText.startsWith(comentariosFijos)) {
            setComentarios(inputText);
        } else {
            setComentarios(comentariosFijos + inputText.replace(comentariosFijos, ''));
        }
    };

    const handleComentariosFocus = () => {
        const currentDate = new Date().toLocaleDateString();
        if (!comentarios.includes(` - ${currentDate}`)) {
            setComentarios(prevComentarios => `${prevComentarios} - ${currentDate} `);
        }
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = filteredVacantes.slice(offset, offset + itemsPerPage); // Usar las vacantes filtradas
    const pageCount = Math.ceil(filteredVacantes.length / itemsPerPage); // Usar las vacantes filtradas

    //Buscador rapido
    const handleJefeChange = (selectedOption) => {
        setJefesId(selectedOption ? selectedOption.value : '');
    };

    const jefeOptions = jefes.map(jefe => ({
        value: jefe.id,
        label: jefe.nombre_completo,
    }));

    return (
        <div>
            <br></br>
            <h5 style={{ color: 'blue' }}>Bienvenid@ {nombre} ({noempl})</h5>
            <br></br>
            <div className="button-container">
                <button type="button" className="btn btn-primary ml-3" onClick={() => { setShowModal(true); setShowTable(false); fetchCatalogData(); }}>
                    Añadir Vacante
                </button>
                <button type="button" className="btn btn-warning ml-3" onClick={() => { setShowTable(true); fetchVacantesData(); }}>
                    Ver Vacantes
                </button>
                {showTable && (
                    <ReactHTMLTableToExcel
                        id="export-to-excel-button"
                        className="btn btn-success ml-3"
                        table="vacantes-table"
                        filename="vacantes"
                        sheet="Vacantes"
                        buttonText="Exportar a Excel" // Aquí se pasa una cadena de texto
                    />
                )}
            </div>
            
            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {showTable && (
                <div className="table-container mt-3">
                    <div className="form-row mb-3">
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha inicio"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha fin"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <table id="vacantes-table" className="table table-striped table-hover table-bordered">
                        <thead className="">
                            <tr>
                                <th>#</th>
                                <th style={{ display: 'none' }}>ID</th>
                                <th>Vacante</th>
                                <th>Área</th>
                                <th>Analista</th>
                                <th>Sueldo</th>
                                <th>Jefe Directo</th>
                                <th>Tipo</th>
                                <th>Fecha de Requisición</th>
                                <th>Fecha de Selección</th>
                                <th>Fecha de Ingreso</th>
                                <th>Estatus</th>
                                <th>Comentario</th>
                                <th>Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.length > 0 ? currentPageData.map((vacante, index) => (
                                <tr key={vacante.id} onClick={() => handleEdit(vacante)}>
                                    <td>{index + 1 + offset}</td>
                                    <td style={{ display: 'none' }}>{vacante.id}</td>
                                    <td>{vacante.nom_vacante}</td>
                                    <td>{vacante.nom_area}</td>
                                    <td>{vacante.analista}</td>
                                    <td>{vacante.sueldo}</td>
                                    <td>{vacante.nom_jefe_directo}</td>
                                    <td>{vacante.nom_tipo}</td>
                                    <td>{vacante.fecha_requisicion}</td>
                                    <td>{vacante.fecha_seleccion}</td>
                                    <td>{vacante.fecha_ingreso}</td>
                                    <td>{vacante.nom_estatus}</td>
                                    <td>{vacante.comentario}</td>
                                    <td>{vacante.fecha_registro}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9">No se encontraron vacantes para el analista {nombre}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"selected"}
                    />
                </div>
            )}

            {showModal && (
                <div className="modal fade show" tabIndex="-1" role="dialog" aria-labelledby="vacanteModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header modal-header-blue">
                                <h5 className="modal-title" id="vacanteModalLabel">Añadir Nueva Vacante</h5>
                                <button type="button" className="close" onClick={() => { setShowModal(false); resetForm(); }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="vacante">Vacante</label>
                                        <select className="form-control" id="vacante" value={vacanteId} onChange={(e) => setVacanteId(e.target.value)}>
                                            <option value="">Seleccione...</option>
                                            {vacantes.map(vacante => (
                                                <option key={vacante.id} value={vacante.id}>{vacante.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="cefa">CEF/Área</label>
                                            <select className="form-control" id="cefa" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {areas.map(area => (
                                                    <option key={area.id} value={area.id}>{area.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="analista">Analista</label>
                                            <select className="form-control" id="analista" value={analistaId} onChange={handleAnalistaChange}>
                                                <option value="">Seleccione...</option>
                                                {analistas.map(analista => (
                                                    <option key={analista.id} value={analista.id}>{analista.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="sueldo">Sueldo</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="sueldo" 
                                                value={sueldo} 
                                                onChange={(e) => setSueldo(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="estatus">Estatus</label>
                                            <select className="form-control" id="estatus" value={estatusId} onChange={(e) => setEstatusId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {estatus.map(status => (
                                                    <option key={status.id} value={status.id}>{status.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="tipo">Tipo</label>
                                            <select className="form-control" id="tipo" value={tipoId} onChange={(e) => setTipoId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {tipo.map(tipo => (
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="jefe">Jefe Directo</label>
                                        <Select
                                            id="jefe"
                                            options={jefeOptions}
                                            value={jefeOptions.find(option => option.value === jefeId)}
                                            onChange={handleJefeChange}
                                            isClearable
                                            placeholder="Seleccione..."
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="fechaRequisicion">Fecha de Requisición</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="fechaRequisicion" 
                                                value={fechaRequisicion} 
                                                onChange={(e) => setFechaRequisicion(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="fechaSeleccion">Fecha de Selección</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="fechaSeleccion" 
                                                value={fechaSeleccion} 
                                                onChange={(e) => setFechaSeleccion(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="fechaIngreso" 
                                                value={fechaIngreso} 
                                                onChange={(e) => setFechaIngreso(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="comentarios">Comentarios</label>
                                        <textarea 
                                            className="form-control" 
                                            id="comentarios" 
                                            rows="3" 
                                            value={comentarios}
                                            onChange={handleComentariosChange}
                                            onFocus={handleComentariosFocus}
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cerrar</button>
                                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && selectedVacante && (
                <div className="modal fade show" tabIndex="-1" role="dialog" aria-labelledby="editVacanteModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header modal-header-blue">
                                <h5 className="modal-title" id="editVacanteModalLabel">Editar Vacante</h5>
                                <button type="button" className="close" onClick={() => { setShowEditModal(false); resetForm(); }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="editVacante">Vacante</label>
                                        <select className="form-control" id="editVacante" value={vacanteId} onChange={(e) => setVacanteId(e.target.value)} >
                                            <option value="">Seleccione...</option>
                                            {vacantes.map(vacante => (
                                                <option key={vacante.id} value={vacante.id}>{vacante.nom_vacante}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="editCefa">CEF/Área</label>
                                            <select className="form-control" id="editCefa" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {areas.map(area => (
                                                    <option key={area.id} value={area.id}>{area.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="editAnalista">Analista</label>
                                            <input type="text" className="form-control" id="editAnalista" value={selectedVacante.analista} disabled />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editSueldo">Sueldo</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="editSueldo" 
                                                value={sueldo} 
                                                onChange={(e) => setSueldo(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editEstatus">Estatus</label>
                                            <select className="form-control" id="editEstatus" value={estatusId} onChange={(e) => setEstatusId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {estatus.map(status => (
                                                    <option key={status.id} value={status.id}>{status.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editTipo">Tipo</label>
                                            <select className="form-control" id="editTipo" value={tipoId} onChange={(e) => setTipoId(e.target.value)}>
                                                <option value="">Seleccione...</option>
                                                {tipo.map(tipo => (
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="editJefe">Jefe Directo</label>
                                        <Select
                                            id="editJefe"
                                            options={jefeOptions}
                                            value={jefeOptions.find(option => option.value === jefeId)}
                                            onChange={handleJefeChange}
                                            isClearable
                                            placeholder="Seleccione..."
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editFechaRequisicion">Fecha de Requisición</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="editFechaRequisicion" 
                                                value={fechaRequisicion} 
                                                onChange={(e) => setFechaRequisicion(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editFechaSeleccion">Fecha de Selección</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="editFechaSeleccion" 
                                                value={fechaSeleccion} 
                                                onChange={(e) => setFechaSeleccion(e.target.value)} 
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="editFechaIngreso">Fecha de Ingreso</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                id="editFechaIngreso" 
                                                value={fechaIngreso} 
                                                onChange={(e) => setFechaIngreso(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="editComentarios">Comentarios</label>
                                        <textarea 
                                            className="form-control" 
                                            id="editComentarios" 
                                            rows="3" 
                                            value={comentarios}
                                            onChange={handleComentariosChange}
                                            onFocus={handleComentariosFocus}
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>Cerrar</button>
                                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Vacantes;
