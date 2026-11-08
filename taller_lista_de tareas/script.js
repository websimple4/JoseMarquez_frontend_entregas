let tareas = [];

const formulario = document.getElementById("formulario");
const entrada = document.getElementById("entrada");
const mensajeError = document.getElementById("error");
const lista = document.getElementById("lista");

const totalEl = document.getElementById("total");
const completadasEl = document.getElementById("completadas");
const pendientesEl = document.getElementById("pendientes");
const barra = document.getElementById("barra");
const relleno = document.getElementById("relleno");
const porcentajeEl = document.getElementById("porcentaje");

function agregarTarea(texto) {
  tareas.push({
    id: Date.now() + Math.random(),
    texto: texto,
    completada: false,
  });
  actualizar();
}

function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = true;
    actualizar();
  }
}

function eliminarTarea(id) {
  tareas = tareas.filter((t) => t.id !== id);
  actualizar();
}

function crearElementoTarea(tarea) {
  const li = document.createElement("li");
  li.className = "tarea" + (tarea.completada ? " completada" : "");
  li.dataset.id = tarea.id;

  const marca = document.createElement("span");
  marca.className = "tarea__marca";
  marca.setAttribute("aria-hidden", "true");
  marca.textContent = "✓";

  const texto = document.createElement("p");
  texto.className = "tarea__texto";
  texto.textContent = tarea.texto;

  const acciones = document.createElement("div");
  acciones.className = "tarea__acciones";

  if (!tarea.completada) {
    const botonCompletar = document.createElement("button");
    botonCompletar.type = "button";
    botonCompletar.className = "boton boton--completar";
    botonCompletar.dataset.accion = "completar";
    botonCompletar.textContent = "Completar";
    acciones.appendChild(botonCompletar);
  }

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "boton boton--eliminar";
  botonEliminar.dataset.accion = "eliminar";
  botonEliminar.textContent = "Eliminar";
  acciones.appendChild(botonEliminar);

  li.append(marca, texto, acciones);
  return li;
}

function renderizarLista() {
  lista.innerHTML = "";
  tareas.forEach((tarea) => lista.appendChild(crearElementoTarea(tarea)));
}

function actualizarContador() {
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  totalEl.textContent = total;
  completadasEl.textContent = completadas;
  pendientesEl.textContent = pendientes;

  relleno.style.width = porcentaje + "%";
  barra.setAttribute("aria-valuenow", porcentaje);
  porcentajeEl.textContent = porcentaje + "%";
}

function actualizar() {
  renderizarLista();
  actualizarContador();
}

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = false;
  entrada.classList.add("es-invalido");
}

function limpiarError() {
  mensajeError.hidden = true;
  mensajeError.textContent = "";
  entrada.classList.remove("es-invalido");
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const texto = entrada.value.trim();

  if (texto === "") {
    mostrarError("Escribe una tarea antes de agregarla.");
    entrada.focus();
    return;
  }

  limpiarError();
  agregarTarea(texto);
  entrada.value = "";
  entrada.focus();
});

entrada.addEventListener("input", limpiarError);

lista.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.closest(".tarea").dataset.id);

  if (boton.dataset.accion === "completar") {
    completarTarea(id);
  } else if (boton.dataset.accion === "eliminar") {
    eliminarTarea(id);
  }
});

actualizar();