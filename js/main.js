/*Productos y Aportes harcodeado iniciales*/
const productosIniciales = [];
productosIniciales.push(new Producto(1, "Tira de asado", 20000, 1));
productosIniciales.push(new Producto(3, "Chorizo", 2000, 4));
productosIniciales.push(new Producto(2, "Vacío", 13250, 1));
productosIniciales.push(new Producto(4, "Pan", 2500, 4));

const aportesIniciales = [];
aportesIniciales.push(new Aporte(1, "Ezequiel", 19262.5));
aportesIniciales.push(new Aporte(2, "Mauro", 10000));
aportesIniciales.push(new Aporte(3, "Sofía", 30000));
aportesIniciales.push(new Aporte(4, "Hernan", 7000));

/*Cargar arrays desde localStorage o usar iniciales*/

function cargarProductos() {
    let lista = [];
    const data = JSON.parse(localStorage.getItem("productos"));
    if (data) {
        data.forEach(p => {
            lista.push(new Producto(p.id, p.nombre, p.precio, p.cantidad));
        });
    } else {
        productosIniciales.forEach(p => {
            lista.push(new Producto(p.id, p.nombre, p.precio, p.cantidad));
        });
    }
    return lista;
}

function cargarAportes() {
    let lista = [];
    const data = JSON.parse(localStorage.getItem("aportes"));
    if (data) {
        data.forEach(a => {
            lista.push(new Aporte(a.id, a.nombre, a.monto));
        });
    } else {
        aportesIniciales.forEach(a => {
            lista.push(new Aporte(a.id, a.nombre, a.monto));
        });
    }
    return lista;
}

let lista = cargarProductos();
let aportes = cargarAportes();

/*DOM*/
const secciones = document.querySelectorAll(".seccion");
const menuBtns = document.querySelectorAll("#menu button");
const productosCtn = document.getElementById("productosCtn");
const aportesCtn = document.getElementById("aportesCtn");
const resumenCtn = document.getElementById("resumenCtn");
const limpiarStorageBtn = document.getElementById("limpiarStorage");

//Formularios y botones limpiar
const formProducto = document.getElementById("formProducto");
const formAporte = document.getElementById("formAporte");
const limpiarProducto = document.getElementById("limpiarProducto");
const limpiarAporte = document.getElementById("limpiarAporte");

/*Funciones*/
function mostrarSeccion(id) {
    secciones.forEach(seccion => {
        if (seccion.id === id) {
            seccion.style.display = "block";
        } else {
            seccion.style.display = "none";
        }
    });
}

function guardarStorage() {
    localStorage.setItem("productos", JSON.stringify(lista));
    localStorage.setItem("aportes", JSON.stringify(aportes));
}

function totalProductos() {
    let total = 0;
    for (const producto of lista) {
        total += producto.subtotal();
    }
    return total;
}

function imprimirResumen() {
    resumenCtn.innerHTML = "";
    const total = totalProductos();
    const personas = aportes.length;
    let cuota = 0;

    if (personas > 0) {
        cuota = total / personas;
    }

    const info = document.createElement("p");
    info.textContent = `Total: $${total.toFixed(2)} - Cuota por persona: $${cuota.toFixed(2)}`;
    resumenCtn.appendChild(info);

    for (const a of aportes) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h4>${a.getNombre()} (ID: ${a.getId()})</h4>
            <p>${a.estado(cuota)}</p>
        `;
        resumenCtn.appendChild(card);
    }
}

function imprimirAportes(){
    aportesCtn.innerHTML="";
    for(const a of aportes){
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h4>${a.getNombre()}</h4>
            <p>ID: ${a.getId()}</p>
            <p>Aporte: $${a.getMonto()}</p>
            <div class="card-buttons">
                <button class="eliminar">Eliminar</button>
            </div>
        `;
        aportesCtn.appendChild(card);

        card.querySelector(".eliminar").addEventListener("click", () => {
            aportes = aportes.filter(aporte => aporte !== a);
            guardarStorage();
            imprimirAportes();
            renderResumen();
        });
    }
}

function imprimirProductos() {
    productosCtn.innerHTML = "";

    for (const p of lista) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h4>${p.getNombre()}</h4>
            <p>ID: ${p.getId()}</p>
            <p>Cantidad: ${p.getCantidad()}</p>
            <p>Precio: $${p.getPrecio()}</p>
            <p>Subtotal: $${p.subtotal()}</p>
            <div class="card-buttons">
                <button class="eliminar">Eliminar</button>
            </div>
        `;
        productosCtn.appendChild(card);

        card.querySelector(".eliminar").addEventListener("click", () => {
            lista = lista.filter(producto => producto !== p);
            guardarStorage();
            imprimirProductos();
            imprimirResumen();
        });
    }
}

/*Eventos*/
for (const btn of menuBtns) {
    btn.addEventListener("click", () => {
        mostrarSeccion(btn.dataset.seccion);
        imprimirProductos();
        imprimirAportes();
        imprimirResumen();
    });
}

formProducto.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = formProducto.prodNombre.value;
    const cantidad = parseFloat(formProducto.prodCantidad.value);
    const precio = parseFloat(formProducto.prodPrecio.value);

    // Siempre agregamos un producto nuevo
    let id;
    if (lista.length > 0) {
        id = lista[lista.length - 1].getId() + 1;
    } else {
        id = 1;
    }

    lista.push(new Producto(id, nombre, precio, cantidad));

    guardarStorage();
    imprimirProductos();
    imprimirResumen();
    formProducto.reset();
});

formAporte.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = formAporte.aporteNombre.value;
    const monto = parseFloat(formAporte.aporteMonto.value);

    let id;
    if (aportes.length > 0) {
        id = aportes[aportes.length - 1].getId() + 1;
    } else {
        id = 1;
    }

    aportes.push(new Aporte(id, nombre, monto));

    guardarStorage();
    imprimirAportes();
    imprimirResumen();
    formAporte.reset();
});

/*Botones limpiar*/
limpiarProducto.addEventListener("click", () => formProducto.reset());
limpiarAporte.addEventListener("click", () => formAporte.reset());

limpiarStorageBtn.addEventListener("click", () => {
    localStorage.clear();
    lista = [];
    aportes = [];
    imprimirProductos();
    imprimirAportes();
    imprimirResumen();
});

/* ====== Inicializar ====== */
mostrarSeccion("productos");
imprimirProductos();
imprimirAportes();
imprimirResumen();
