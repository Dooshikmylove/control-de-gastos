// Variables y elementos
var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var divPresupuesto = document.querySelector('#divPresupuesto');
var presupuesto = document.querySelector('#presupuesto');
var btnPresupuesto = document.querySelector('#btnPresupuesto');
var divGastos = document.querySelector('#divGastos');
var progress = document.querySelector('#progress');
var tGastos = 0;
var disponible = 0;

// Inicializar la aplicación
const inicio = () => {
    tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
    if (tPresupuesto > 0) {
        divGastos.classList.add("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.remove("d-block");
        divPresupuesto.classList.add("d-none");
        totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
        mostrarGastos();
    } else {
        divGastos.classList.add("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.remove("d-none");
        divPresupuesto.classList.add("d-block");
        presupuesto.value = 0;
    }
};


// Filtrar gastos por categoría
document.querySelector('#filtrarcategoria').addEventListener('change', function() {
    mostrarGastos(this.value);
});

// Evento para establecer el presupuesto inicial
btnPresupuesto.onclick = () => {
    tPresupuesto = parseInt(presupuesto.value);
    if (tPresupuesto == 0 || tPresupuesto<0 || tPresupuesto.trim() === "" ) {
        Swal.fire({icon: "error", title: "ERROR", text: "Presupuesto mayor a 0"});
        return;
    }
    localStorage.setItem('presupuesto', tPresupuesto);
    divGastos.classList.add("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.remove("d-block");
    divPresupuesto.classList.add("d-none");
    mostrarGastos();
};

// Guardar nuevo gasto
const guardarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.getElementById("descripcion").value;
    let costo = parseInt(document.getElementById("costo").value);
    let categoria = document.getElementById("categoria").value;

    if (descripcion.trim() === "" || isNaN(costo) || costo === 0) {
        Swal.fire({icon: "error", title: "ERROR", text: "Datos incorrectos"});
        return;
    }
    if (costo > disponible) {
        Swal.fire({icon: "error", title: "ERROR", text: "Ya no tienes fondos"});
        return;
    }

    const gasto = { descripcion, costo, categoria };
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    bootstrap.Modal.getInstance(document.getElementById("nuevoGasto")).hide();
    mostrarGastos();
};

// Mostrar gastos filtrados
const mostrarGastos = (categoria = "todos") => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gastosHTML = ``;
    tGastos = 0;
    
    gastos.forEach((gasto, index) => {
        if (categoria === gasto.categoria || categoria === "todos") {
            gastosHTML += `
                <div class="card text-center w-100 m-auto mt-3 p-2" style="border-color: cadetblue; color: white">
                    <div class="row">
                        <div class="col"><img src="img/${gasto.categoria}.png" class="imgCategoria" width="100px" height="100px"></div>
                        <div class="col text-start">
                            <p><b>Descripcion: </b><small>${gasto.descripcion}</small></p>
                            <p><b>Costo: </b><small>$ ${parseInt(gasto.costo).toFixed(2)}</small></p>
                        </div>
                        <div class="col">
                            <button class="btn" style="background: goldenrod; border-color: cadetblue;" onclick="cargarGasto(${index})" data-bs-toggle="modal" data-bs-target="#cargarGasto"><img src="img/editar.png" width="30px" height="30px" alt=""></button>
                            <button class="btn" style="background-color: darkred; border-color: cadetblue;" onclick="deleteGasto(${index})"><img src="img/borrar.png" width="30px" height="30px" alt=""></button>
                        </div>
                    </div>
                </div>`;
            tGastos += parseInt(gasto.costo);
        }
    });

    document.getElementById('listaGastos').innerHTML = gastosHTML || `<b>NO HAY GASTOS</b>`;
    pintarDatos();
};

// Actualizar barra de progreso y campos de presupuesto
const pintarDatos = () => {
    let totalPresupuesto = document.querySelector("#totalPresupuesto");
    let totalDisponible = document.querySelector("#totalDisponible");
    let totalGastos = document.querySelector("#totalGastos");
    tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
    disponible = tPresupuesto - tGastos;
    let porcentaje = (disponible / tPresupuesto) * 100;

    // Cambiar el color de la barra de progreso dependiendo del porcentaje restante
    let colorBarra;
    if (porcentaje > 50) {
        colorBarra = 'darkolivegreen';
    } else if (porcentaje > 20) {
        colorBarra = 'goldenrod';
    } else {
        colorBarra = 'darkred';
        // Mostrar alerta si el saldo es bajo
        Swal.fire({
            title: '¡Advertencia!',
            text: 'Estás a punto de quedarte sin fondos.',

            imageUrl: 'img/_ 📁__ Kang Dooshik icon _ Pearl boy _(조개소년).jpeg',
            imageWidth: 200,
            imageHeight: 200
        });
    }

    // Actualizar la barra de progreso
    $('#progress').circleProgress({
        value: porcentaje / 100,
        size: 120,
        fill: { color: colorBarra },
        animation: { duration: 800 }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $('#progress-text').text((stepValue * 100).toFixed(0) + '%');
    });

    // También puedes actualizar el texto directamente si lo prefieres
    $('#progress-text').text(porcentaje.toFixed(0) + '%');

    totalGastos.innerHTML = `$ ${tGastos.toFixed(2)}`;
    totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
    totalDisponible.innerHTML = `$ ${disponible.toFixed(2)}`;
}

// Editar gasto
const cargarGasto = (index) => {
    var gasto = gastos[index];
    document.getElementById("edescripcion").value = gasto.descripcion;
    document.getElementById("ecosto").value = gasto.costo;
    document.getElementById("ecategoria").value = gasto.categoria;
    document.getElementById("eindex").value = index;
};

// Actualizar gasto editado
const actualizarGasto = () => {
    let index = parseInt(document.getElementById("eindex").value);
    let descripcion = document.getElementById("edescripcion").value;
    let costo = parseInt(document.getElementById("ecosto").value);
    let categoria = document.getElementById("ecategoria").value;

    if (descripcion.trim() === "" || isNaN(costo) || costo === 0) {
        Swal.fire({icon: "error", title: "ERROR", text: "Datos incorrectos"});
        return;
    }
    if (costo > (gastos[index].costo + disponible)) {
        Swal.fire({icon: "error", title: "ERROR", text: "Ya no tienes fondos"});
        return;
    }

    gastos[index].descripcion = descripcion;
    gastos[index].costo = costo;
    gastos[index].categoria = categoria;
    localStorage.setItem("gastos", JSON.stringify(gastos));
    bootstrap.Modal.getInstance(document.getElementById("cargarGasto")).hide();
    mostrarGastos();

    Swal.fire({
        title: 'Gasto actualizado',
        text: 'El gasto se ha actualizado correctamente.',
        imageUrl: 'img/°˖✧ Sign _ Señas ✧˖°.jpeg', // Puedes cambiar la imagen aquí
        imageWidth: 200,
        imageHeight: 200,
    });
};

// Eliminar gasto
const deleteGasto = (index) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Este gasto será eliminado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'darkolivegreen',
        cancelButtonColor: 'darkred',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            gastos.splice(index, 1);
            localStorage.setItem("gastos", JSON.stringify(gastos));
            mostrarGastos();
        }
    });
};

const reset=()=>{
    localStorage.clear();
    inicio();
}
