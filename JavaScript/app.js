
//Inicializa la aplicación

async function inicializarApp() {
    console.log('🚀 Iniciando Estética360...');

    // Cargar usuario desde sessionStorage
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    State.usuarioActual = usuario;
    console.log("👤 Usuario actual:", State.usuarioActual);

    Navbar.render();
    Sidebar.render();

    mostrarCargando();

    try {
        // ------------------------------
        // 4️⃣ Cargar todos los datos necesarios en paralelo
        // ------------------------------
        console.log('📡 Cargando datos desde API...');
        
        await Promise.all([
            cargarEmpleados(),
            cargarServicios(),
            cargarClientes(),
            cargarTurnos(),
            cargarAvisos()
        ]);

        console.log('✅ Todos los datos cargados correctamente');
        console.log('📊 Estado actual:', {
            empleados: State.empleados.length,
            servicios: State.servicios.length,
            clientes: State.clientes.length,
            turnos: State.turnos.length
        });

        //  Renderizar sección inicial

        if (State.seccionActual === "empleados") {
            Empleados.render();
        } else if (State.seccionActual === "turnos") {
            Turnos.render();
        } else {
            Inicio.render();
        }

        //  Mostrar notificación de bienvenida

        setTimeout(() => {
            Utilidades.mostrarNotificacion(`¡Bienvenido/a ${State.usuarioActual.nombre}! 🎉`);
        }, 500);

    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        document.getElementById("mainContent").innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fas fa-exclamation-triangle"></i> Error de Conexión</h4>
                <p>No se pudieron cargar los datos del servidor. Por favor, verifica tu conexión e intenta nuevamente.</p>
                <button class="btn btn-custom btn-primary-custom mt-3" onclick="location.reload()">
                    <i class="fas fa-sync"></i> Reintentar
                </button>
            </div>
        `;
    }

    console.log('✅ Aplicación iniciada correctamente');
}


function mostrarCargando() {
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <h4 class="mt-4 text-secondary">Cargando datos...</h4>
                <p class="text-muted">Por favor espera un momento</p>
            </div>
        `;
    }
}


async function cargarEmpleados() {
    try {
        console.log('👥 Cargando empleados...');
        const resultado = await ApiServicios.obtenerEmpleados();
        
        if (!resultado.success && resultado.empleados) {
            StateManager.setEmpleados(resultado.empleados);
        }
        
        console.log(`✅ ${State.empleados.length} empleados cargados`);
    } catch (error) {
        console.error('❌ Error al cargar empleados:', error);
        throw error;
    }
}


async function cargarServicios() {
    try {
        console.log('✂️ Cargando servicios...');
        await ApiServicios.obtenerServicios();
        console.log(`✅ ${State.servicios.length} servicios cargados`);
    } catch (error) {
        console.error('❌ Error al cargar servicios:', error);
        throw error;
    }
}

async function cargarClientes() {
    try {
        console.log('👤 Cargando clientes...');
        const resultado = await ApiServicios.obtenerClientes();
        
        if (Array.isArray(resultado)) {
            StateManager.setClientes(resultado);
            console.log(`✅ ${resultado.length} clientes cargados`);
        } else if (resultado.success && Array.isArray(resultado.clientes)) {
            StateManager.setClientes(resultado.clientes);
            console.log(`✅ ${resultado.clientes.length} clientes cargados`);
        } else if (resultado.error) {
            console.warn('⚠️ Error al cargar clientes:', resultado.error);
            StateManager.setClientes([]);
        } else {
            console.warn('⚠️ No se encontraron clientes');
            StateManager.setClientes([]);
        }
    } catch (error) {
        console.error('❌ Error al cargar clientes:', error);
        StateManager.setClientes([]);
    }
}

async function cargarTurnos() {
    try {
        console.log('📅 Cargando turnos...');
        const resultado = await ApiServicios.obtenerTurnos();

        let turnos = [];

        if (resultado.success && Array.isArray(resultado.turnos)) {
            turnos = resultado.turnos;
        } else if (Array.isArray(resultado)) {
            turnos = resultado;
        } else {
            console.warn('⚠️ No se pudieron cargar los turnos:', resultado);
            StateManager.setTurnos([]);
            return;
        }

        // Mapeo usando los nombres EXACTOS de campos de tu API
        const turnosMapeados = turnos.map(t => {
            const nombreCliente = `${t.cliente_nombre || ''} ${t.cliente_apellido || ''}`.trim();
            const nombreEmpleado = `${t.empleado_nombre || ''} ${t.empleado_apellido || ''}`.trim();
            
            return {
                id: t.id_turno,
                id_empleado: t.id_empleado,
                cliente: nombreCliente || 'Sin cliente',
                telefono: t.cliente_telefono || '',
                servicio: t.nombre_servicio || 'Sin servicio',
                hora: t.horario || 'Sin hora',
                empleado: nombreEmpleado || 'Sin empleado',
                duracion: t.duracion_estimada || '30 min',
                estado: t.estado || 'Pendiente',
                dia: t.dia || '',
                sugerencias: t.sugerencias || ''
            };
        });

        StateManager.setTurnos(turnosMapeados);
        console.log(`✅ ${turnosMapeados.length} turnos cargados y mapeados correctamente`);
    } catch (error) {
        console.error('❌ Error al cargar turnos:', error);
        StateManager.setTurnos([]);
    }
}


async function cargarAvisos() {
    try {
        console.log('📢 Cargando avisos...');
        if (typeof Inicio !== 'undefined' && typeof Inicio.cargarAvisosDesdeDB === 'function') {
            await Inicio.cargarAvisosDesdeDB();
        }
    } catch (error) {
        console.error('❌ Error al cargar avisos:', error);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

// Funciones globales auxiliares

window.toggleSidebarMobile = Utilidades.toggleSidebarMobile;

// Función global para cambiar sección (usada por navbar/sidebar)
window.cambiarSeccion = function(seccion) {
    Router.navegarSeccion(seccion);
};

// ------------------------------
// Función global para cambiar acción (usada por sidebar)
// ------------------------------
window.cambiarAccion = function(accion) {
    Router.navegarAccion(accion);
};

// ------------------------------
// Función global para cerrar sesión
// ------------------------------
window.cerrarSesion = function() {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
        StateManager.cerrarSesion();
        window.location.href = "login.html";
    }
};

// ------------------------------
// Función global para recargar datos (útil después de crear/editar)
// ------------------------------
window.recargarDatos = async function() {
    console.log('🔄 Recargando datos...');
    try {
        await Promise.all([
            cargarEmpleados(),
            cargarServicios(),
            cargarClientes(),
            cargarTurnos()
        ]);
        console.log('✅ Datos recargados correctamente');
    } catch (error) {
        console.error('❌ Error al recargar datos:', error);
    }
};

// Exportar cargarTurnos para uso en otros archivos

window.cargarTurnos = cargarTurnos;

console.log("✅ app.js cargado");