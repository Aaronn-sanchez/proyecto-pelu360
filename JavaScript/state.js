// // ============================================
// // ESTADO GLOBAL DE LA APLICACIÓN
// // ============================================

// const State = {
//     // Usuario actual (null hasta que haga login)
//     usuarioActual: null,
    
//     // Datos que vienen de la API
//     empleados: [],

//     // Datos que vienen de la API
//     servicios: [],  
    
//     // Datos mock (estos podrían venir de la API también)
//     turnos: [
//         {
//             cliente: "Laura Gómez", 
//             telefono: "381456789", 
//             servicio: "Corte", 
//             empleado: "Sofía Herrero", 
//             duracion: "45 min", 
//             hora: "10:00", 
//             dia: "Lunes", 
//             estado: "Confirmado", 
//             sugerencias: "Usar shampoo hidratante"
//         },
//         {
//             cliente: "María López", 
//             telefono: "381987654", 
//             servicio: "Color", 
//             empleado: "Laura Lopezz", 
//             duracion: "1h 30m", 
//             hora: "11:00", 
//             dia: "Martes", 
//             estado: "Pendiente", 
//             sugerencias: "Confirmar tono antes de aplicar"
//         },
//         {
//             cliente: "Valentina Cruz", 
//             telefono: "381654321", 
//             servicio: "Peinado", 
//             empleado: "Diego Pérez", 
//             duracion: "30 min", 
//             hora: "15:00", 
//             dia: "Viernes", 
//             estado: "Confirmado", 
//             sugerencias: "Preparar planchita y spray fijador"
//         }
//     ],
    
//     alertas: [
//         "Recordá revisar la agenda antes de aceptar nuevos turnos.",
//         "El viernes hay capacitación a las 17:00."
//     ],
    
//     // Estado de navegación
//     seccionActual: "inicio",
//     accionActual: "ver"
// };

// // Funciones para modificar el estado
// const StateManager = {
//     // Usuario
//     setUsuario(usuario) {
//         State.usuarioActual = usuario;
//     },
    
//     cerrarSesion() {
//         State.usuarioActual = null;
//         State.seccionActual = "login";
//         State.accionActual = "ver";
//     },
    
//     // Empleados
//     setEmpleados(empleados) {
//         State.empleados = empleados;
//     },
    
//     agregarEmpleado(empleado) {
//         State.empleados.push(empleado);
//     },
    
//     eliminarEmpleado(index) {
//         State.empleados.splice(index, 1);
//     },
    
//     // Turnos
//     agregarTurno(turno) {
//         State.turnos.push(turno);
//     },
    
//     eliminarTurno(index) {
//         State.turnos.splice(index, 1);
//     },
    
//     // Alertas
//     agregarAlerta(alerta) {
//         State.alertas.push(alerta);
//     },
    
//     eliminarAlerta(index) {
//         State.alertas.splice(index, 1);
//     },
    
//     // Navegación
//     cambiarSeccion(seccion) {
//         State.seccionActual = seccion;
//     },
    
//     cambiarAccion(accion) {
//         State.accionActual = accion;
//     },

//      setServicios(servicios) {
//         State.servicios = servicios;
//     },
    
//     agregarServicio(servicio) {
//         State.servicios.push(servicio);
//     },
    
//     eliminarServicio(index) {
//         State.servicios.splice(index, 1);
//     }
// };

// ============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================

const State = {
    // Usuario actual (null hasta que haga login)
    usuarioActual: null,
    
    // Datos que vienen de la API
    empleados: [],
    servicios: [],
    turnos: [],
    clientes: [],
    
    // Alertas
    alertas: [],
    
    // Estado de navegación
    seccionActual: "inicio",
    accionActual: "ver"
};

// Funciones para modificar el estado
const StateManager = {
    // Usuario
    setUsuario(usuario) {
        State.usuarioActual = usuario;
    },
    
    cerrarSesion() {
        State.usuarioActual = null;
        State.seccionActual = "login";
        State.accionActual = "ver";
        sessionStorage.removeItem("usuario");
    },
    
    // Empleados
    setEmpleados(empleados) {
        State.empleados = empleados;
        console.log("✅ Estado: Empleados actualizados", empleados.length);
    },
    
    agregarEmpleado(empleado) {
        State.empleados.push(empleado);
    },
    
    eliminarEmpleado(index) {
        State.empleados.splice(index, 1);
    },
    
    // Servicios
    setServicios(servicios) {
        State.servicios = servicios;
        console.log("✅ Estado: Servicios actualizados", servicios.length);
    },
    
    agregarServicio(servicio) {
        State.servicios.push(servicio);
    },
    
    eliminarServicio(index) {
        State.servicios.splice(index, 1);
    },
    
    // Turnos
    setTurnos(turnos) {
        State.turnos = turnos;
        console.log("✅ Estado: Turnos actualizados", turnos.length);
    },
    
    agregarTurno(turno) {
        State.turnos.push(turno);
    },
    
    eliminarTurno(index) {
        State.turnos.splice(index, 1);
    },
    
    actualizarTurno(id_turno, turnoActualizado) {
        const index = State.turnos.findIndex(t => t.id_turno == id_turno);
        if (index !== -1) {
            State.turnos[index] = turnoActualizado;
        }
    },
    
    // Clientes
    setClientes(clientes) {
        State.clientes = clientes;
        console.log("✅ Estado: Clientes actualizados", clientes.length);
    },
    
    agregarCliente(cliente) {
        State.clientes.push(cliente);
    },
    
    eliminarCliente(index) {
        State.clientes.splice(index, 1);
    },
    
    // Alertas
    agregarAlerta(alerta) {
        State.alertas.push(alerta);
    },
    
    eliminarAlerta(index) {
        State.alertas.splice(index, 1);
    },
    
    // Navegación
    cambiarSeccion(seccion) {
        State.seccionActual = seccion;
        console.log("📍 Sección actual:", seccion);
    },
    
    cambiarAccion(accion) {
        State.accionActual = accion;
        console.log("🎯 Acción actual:", accion);
    }
};

console.log("✅ state.js cargado");