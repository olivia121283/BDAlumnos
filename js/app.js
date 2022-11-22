let alumnosDB; 
let semestreGrupoDB;
let ordenAlumno = 'asc';


function agregarTodosLosEventos() {
  const agregarAlumnoFormulario = document.getElementById("formulario-agregar-alumno");
  const buscarAlumnoFormulario = document.getElementById("formulario-buscar-alumno");
  const limpiarBusquedaBoton = document.getElementById("limpiar-busqueda");
  const orderByName = document.getElementById("order-by-name");

  agregarAlumnoFormulario.addEventListener("submit", agregarAlumno);
  buscarAlumnoFormulario.addEventListener("submit", buscarAlumno);
  limpiarBusquedaBoton.addEventListener("click", limpiarBusqueda);
  orderByName.addEventListener("click", ordenarEstudiantesPorNombre);
}

function cargarBaseDatos() {
  let baseDatos = localStorage.getItem('estudiantes');

  if(!baseDatos) {
    localStorage.setItem('estudiantes', JSON.stringify([]))
    baseDatos = localStorage.getItem('estudiantes');
  }

    alumnosDB = JSON.parse(baseDatos);
}

function agregarAlumno(evento){
  evento.preventDefault();
  const id = alumnosDB.length+1;
  const nombre = document.querySelector("#formulario-agregar-alumno input[id='input-nombre']")?.value;
  const apellidoPaterno = document.querySelector("#formulario-agregar-alumno input[id='input-apellido-paterno']")?.value;
  const apellidoMaterno = document.querySelector("#formulario-agregar-alumno input[id='input-apellido-materno']")?.value;
  const edad = document.querySelector("#formulario-agregar-alumno input[id='input-edad']")?.value;
  const genero = document.getElementById('select-genero')?.value
  const grupo = document.getElementById('select-grupo')?.value
  const semestre = document.getElementById('select-semestre')?.value
  const materiasOpciones = document.querySelectorAll('input[name="materia"]');
  const materias = [];
  
  materiasOpciones.forEach((checkbox)=>{
    if(checkbox.checked)
      materias.push(checkbox.value)
  })

  alumnosDB.push({
    id,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    edad,
    genero: genero !== 'placeholder' ? genero : null,
    semestre: semestre !== 'placeholder' ? semestre: null,
    grupo:  grupo !== 'placeholder' ? grupo: null,
    materias
  });

  localStorage.setItem('estudiantes', JSON.stringify(alumnosDB))

  limpiarFormulario();
  actualizarTablaEstudiantes(alumnosDB);
  alert('Usuario guardado exitosamente');
}

function limpiarFormulario() {
  const nombre = document.querySelector("#formulario-agregar-alumno input[id='input-nombre']");
  const apellidoPaterno = document.querySelector("#formulario-agregar-alumno input[id='input-apellido-paterno']");
  const apellidoMaterno = document.querySelector("#formulario-agregar-alumno input[id='input-apellido-materno']");
  const edad = document.querySelector("#formulario-agregar-alumno input[id='input-edad']");
  const genero = document.getElementById('select-genero');
  const grupo = document.getElementById('select-grupo');
  const semestre = document.getElementById('select-semestre');
  const materiasOpciones = document.querySelectorAll('input[name="materia"]');

  nombre.value = ''; 
  apellidoPaterno.value = ''; 
  apellidoMaterno.value = ''; 
  edad.value = '';
  genero.value = 'placeholder';
  grupo.value = 'placeholder';
  semestre.value = 'placeholder';
  materiasOpciones.forEach((checkbox)=>{
    checkbox.checked = false;
  })
}

function actualizarTablaEstudiantes(listAlumnos) {
  const tablaEstudiantes = document.getElementById('estudiantes-tabla');
  tablaEstudiantes.innerHTML = '';

  listAlumnos.forEach((alumno)=>{
    // Agrea el tr
    const nuevaFila = tablaEstudiantes.insertRow();
    const estudianteValores = Object.values(alumno);

    // Agrega los td 
    estudianteValores.forEach((valor, idx) => {
      const celda = nuevaFila.insertCell(idx);
      const texto = document.createTextNode(valor || 'N/A');
      celda.appendChild(texto);
    });

    // Agrega el boton eliminar
    const celda = nuevaFila.insertCell(estudianteValores.length);
    const botonEliminar = document.createElement("button");
    botonEliminar.className = 'btn btn-sm btn-outline-danger';
    
    // Agregar icono al boton de eliminar
    const iconoBoton = document.createElement('i');
    iconoBoton.className = 'bi bi-trash';
    botonEliminar.appendChild(iconoBoton);
    botonEliminar.addEventListener('click', function() { eliminarAlumno(alumno.id) } )

    // Agregar boton eliminar al td
    celda.appendChild(botonEliminar);
  });
}

function eliminarAlumno(idAlumno){
  const alumnoIndex = alumnosDB.findIndex((alumno)=>alumno.id === idAlumno);
  
  alumnosDB.splice(alumnoIndex, 1);
  localStorage.setItem('estudiantes', JSON.stringify(alumnosDB));

  actualizarTablaEstudiantes(alumnosDB);
}

function buscarAlumno(evento){
  evento.preventDefault();
  const nombre = document.getElementById('search-nombre')?.value?.toLowerCase();
  const apellidoPaterno = document.getElementById('search-apellido-paterno')?.value?.toLowerCase();
  const apellidoMaterno = document.getElementById('search-apellido-materno')?.value?.toLowerCase();

  const filtros = [nombre, apellidoPaterno, apellidoMaterno].filter((filtro)=>filtro !== '')

  const resultadoBusquedaAlumnos = alumnosDB.filter(alumno => {
    if (nombre === '' && apellidoPaterno === '' && apellidoMaterno === '')
      return true;

    return (nombre != '' && alumno.nombre.toLowerCase().includes(nombre)) || 
    (apellidoPaterno !== '' && alumno.apellidoPaterno.toLowerCase().includes(apellidoPaterno)) || 
    (apellidoMaterno !== '' && alumno.apellidoMaterno.toLowerCase().includes(apellidoMaterno))
  })  
  
  actualizarTablaEstudiantes(resultadoBusquedaAlumnos)
}

function limpiarBusqueda(e){
  e.preventDefault();
  actualizarTablaEstudiantes(alumnosDB);
}

function ordenarEstudiantesPorNombre(e){
  e.preventDefault();

  const estudiantesOrdenados = [...alumnosDB].sort((estudianteUno, estudianteDos)=>{
    const nombreUno = estudianteUno.nombre.toLowerCase();
    const nombreDos= estudianteDos.nombre.toLowerCase();

    if (ordenAlumno === 'asc') {
      ordenAlumno = 'desc'
      return (nombreUno < nombreDos) ? -1 : (nombreUno > nombreDos) ? 1 : 0;
    }

    if(ordenAlumno === 'desc') {
      ordenAlumno = 'asc'
      return (nombreUno > nombreDos) ? -1 : (nombreUno < nombreDos) ? 1 : 0;
  }
  });

  actualizarTablaEstudiantes(estudiantesOrdenados);
}


agregarTodosLosEventos()
cargarBaseDatos()
actualizarTablaEstudiantes(alumnosDB)