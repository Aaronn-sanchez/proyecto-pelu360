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
    
    // Estado de navegación
    seccionActual: "inicio",
    accionActual: "ver"
};

// Funciones para modificar el estado
const StateManager = {
    // USUARIO
    
    setUsuario(usuario) {
        State.usuarioActual = usuario;
    },
    
    cerrarSesion() {
        State.usuarioActual = null;
        State.seccionActual = "login";
        State.accionActual = "ver";
        sessionStorage.removeItem("usuario");
    },
    
    // EMPLEADOS
    
    setEmpleados(empleados) {
        State.empleados = empleados;
        console.log("✅ Estado: Empleados actualizados", empleados.length);
    },
    
    agregarEmpleado(empleado) {
        State.empleados.push(empleado);
    },
    
    eliminarEmpleado(id_usuario) {
        State.empleados = State.empleados.filter(e => e.id_usuario != id_usuario);
        console.log(`🗑️ Empleado ${id_usuario} eliminado del estado`);
    },
    
    // SERVICIOS
    
    setServicios(servicios) {
        State.servicios = servicios;
        console.log("✅ Estado: Servicios actualizados", servicios.length);
    },
    
    agregarServicio(servicio) {
        State.servicios.push(servicio);
    },
    
    eliminarServicio(id_servicio) {
        State.servicios = State.servicios.filter(s => s.id_servicio != id_servicio);
        console.log(`🗑️ Servicio ${id_servicio} eliminado del estado`);
    },
    
    // TURNOS
    
    setTurnos(turnos) {
        State.turnos = turnos;
        console.log("✅ Estado: Turnos actualizados", turnos.length);
    },
    
    agregarTurno(turno) {
        State.turnos.push(turno);
    },
    
    eliminarTurno(id_turno) {
        State.turnos = State.turnos.filter(t => t.id_turno != id_turno);
        console.log(`🗑️ Turno ${id_turno} eliminado del estado`);
    },
    
    actualizarTurno(id_turno, turnoActualizado) {
        const index = State.turnos.findIndex(t => t.id_turno == id_turno);
        if (index !== -1) {
            State.turnos[index] = turnoActualizado;
            console.log(`✏️ Turno ${id_turno} actualizado en el estado`);
        }
    },
    
    // CLIENTES
    
    setClientes(clientes) {
        State.clientes = clientes;
        console.log("✅ Estado: Clientes actualizados", clientes.length);
    },
    
    agregarCliente(cliente) {
        State.clientes.push(cliente);
    },
    
    eliminarCliente(id_cliente) {
        State.clientes = State.clientes.filter(c => c.id_cliente != id_cliente);
        console.log(`🗑️ Cliente ${id_cliente} eliminado del estado`);
    },
    
    // NAVEGACIÓN
    
    cambiarSeccion(seccion) {
        State.seccionActual = seccion;
        console.log("🔖 Sección actual:", seccion);
    },
    
    cambiarAccion(accion) {
        State.accionActual = accion;
        console.log("🎯 Acción actual:", accion);
    }
};

console.log("✅ state.js cargado");