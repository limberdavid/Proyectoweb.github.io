
// ==========================
// PRODUCTOS
// ==========================
const productos = {
    comidas: [
        { nombre: "Pizza", precio: 40, img: "pizza.jpg" },
        { nombre: "Hamburguesa", precio: 30, img: "https://images.unsplash.com/photo-1550547660-d9450f859349" },
        { nombre: "Hot Dog", precio: 20, img: "HOT.jpg" },
        { nombre: "Ensalada ", precio: 25, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
    ],
    bebidas: [
        { nombre: "Coca Cola", precio: 10, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e" },
        { nombre: "Fanta", precio: 10, img: "FANTA.jpg" },
        { nombre: "Agua", precio: 5, img: "AGUA.jpg" },
        { nombre: "Jugo Natural", precio: 12, img: "NARANJA.jpg" }
    ],
    postres: [
        { nombre: "Torta Chocolate", precio: 25, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
        { nombre: "Helado Vainilla", precio: 15, img: "VAINILLA.jpg" },
        { nombre: "Brownie", precio: 18, img: "CHOCO.jpg" },
        { nombre: "Cheesecake", precio: 20, img: "Cheesecake.jpg" }
    ]
};

// ==========================
// VARIABLES
// ==========================
let carrito = [];
let total = 0;

// ==========================
// CARGAR MENÚ
// ==========================
function cargarMenu() {
    for (let cat in productos) {
        const cont = document.getElementById(cat);
        productos[cat].forEach(p => {
            cont.innerHTML += `
                <div class="card">
                    <img src="${p.img}">
                    <h3>${p.nombre}</h3>
                    <p>Bs ${p.precio}</p>
                    <button onclick="agregar('${p.nombre}', ${p.precio})">Agregar</button>
                </div>
            `;
        });
    }
}

// ==========================
// SECCIONES
// ==========================
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    setTimeout(() => document.getElementById(id).classList.add('activa'), 50);
}

// ==========================
// CARRITO
// ==========================
function agregar(nombre, precio) {
    const id = Date.now();
    carrito.push({ id, nombre, precio });
    total += precio;
    animarAlCarrito(nombre); // Animación
    setTimeout(() => actualizarCarrito(), 300);
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    carrito.forEach(p => {
        lista.innerHTML += `<li>${p.nombre} - Bs ${p.precio} <button onclick="eliminarProducto(${p.id})" class="btn-eliminar">X</button></li>`;
    });
    document.getElementById("total").textContent = total;
}

function eliminarProducto(id) {
    const index = carrito.findIndex(p => p.id === id);
    if(index !== -1) {
        total -= carrito[index].precio;
        carrito.splice(index, 1);
        actualizarCarrito();
    }
}

// ==========================
// ANIMACIÓN AL CARRITO
// ==========================
function animarAlCarrito(nombre) {
    const cards = document.querySelectorAll('.card');
    let card;
    cards.forEach(c => {
        if(c.querySelector('h3').textContent === nombre) card = c;
    });
    if(!card) return;

    const clone = card.cloneNode(true);
    clone.style.position = "absolute";
    const rect = card.getBoundingClientRect();
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.transition = "all 0.7s ease-in-out";
    clone.style.zIndex = 1000;
    document.body.appendChild(clone);

    const carritoRect = document.querySelector('.carrito').getBoundingClientRect();
    setTimeout(() => {
        clone.style.top = carritoRect.top + "px";
        clone.style.left = carritoRect.left + "px";
        clone.style.width = "50px";
        clone.style.opacity = "0";
    }, 50);

    setTimeout(() => {
        document.body.removeChild(clone);
    }, 750);
}

// ==========================
// CHECKOUT
// ==========================
function abrirCheckout() {
    if (!carrito.length) return alert("Carrito vacío");

    const lista = document.getElementById("lista-checkout");
    lista.innerHTML = "";
    carrito.forEach(p => lista.innerHTML += `<li>${p.nombre} - Bs ${p.precio}</li>`);

    document.getElementById("total-checkout").textContent = total;
    document.getElementById("checkout").style.display = "flex";
}

function cerrarCheckout() {
    document.getElementById("checkout").style.display = "none";
}

function mostrarTarjeta(mostrar) {
    document.getElementById("tarjeta").style.display = mostrar ? "block" : "none";
    document.getElementById("qr").style.display = "none";
}


function mostrarQR(mostrar) {
    document.getElementById("qr").style.display = mostrar ? "block" : "none";
}


// ==========================
// CONFIRMAR COMPRA
// ==========================
function confirmarCompra() {
    const cliente = document.getElementById("cliente").value;
    if (!cliente) return alert("Ingrese nombre");

    const metodo = document.querySelector('input[name="pago"]:checked').value;
    const listaProductos = carrito.map(p => `${p.nombre} (Bs ${p.precio})`).join(", ");

    document.getElementById("ventas").innerHTML += `
        <div class="venta">
            <strong>Cliente:</strong> ${cliente}<br>
            <strong>Productos:</strong> ${listaProductos}<br>
            <strong>Total:</strong> Bs ${total}<br>
            <strong>Pago:</strong> ${metodo}
        </div>
    `;

    carrito = [];
    total = 0;
    actualizarCarrito();
    cerrarCheckout();
}
/* ==========================
   MODO OSCURO
========================== */
function toggleModoOscuro() {
    document.body.classList.toggle("dark");
    const btn = document.getElementById("modoOscuroBtn");

    if (document.body.classList.contains("dark")) {
        btn.textContent = "☀️";
        localStorage.setItem("modo", "oscuro");
    } else {
        btn.textContent = "🌙";
        localStorage.setItem("modo", "claro");
    }
}

if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("dark");
    document.getElementById("modoOscuroBtn").textContent = "☀️";
}
// ==========================
// INICIALIZAR
// ==========================
cargarMenu();

// ==========================
// CONFIRMAR COMPRA CON ENTER
// ==========================
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const checkout = document.getElementById("checkout");

        // Verifica si el checkout está abierto
        if (checkout.style.display === "flex") {
            confirmarCompra();
        }
    }
});

