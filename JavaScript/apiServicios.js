// ============================================
// API SERVICIOS - Todas las llamadas al backend
// ============================================

const ApiServicios = {
    baseURL: (window.location.hostname === "localhost")
    ? "http://localhost/estetica360/api/index.php"
    : "https://sanchez.ctpoba.com/estetica360/api/index.php",

    // ============================================
    // LOGIN
    // ============================================
    async login(usuario, contraseña) {
        try {
            console.log("🌐 Enviando petición a:", `${this.baseURL}?recurso=login`);
            
            const response = await fetch(`${this.baseURL}?recurso=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario_login: usuario,
                    pass: contraseña
                })
            });
            
            console.log("📡 Status HTTP:", response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("📥 Respuesta completa del servidor:", data);
            
            if (data.success && data.usuario) {
                return {
                    success: true,
                    id_usuario: data.usuario.id_usuario,
                    nombre: data.usuario.nombre,
                    apellido: data.usuario.apellido,
                    usuario_login: data.usuario.usuario_login,
                    rol: data.usuario.rol
                };
            } else if (data.error) {
                return {
                    success: false,
                    message: data.error
                };
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error en login:', error);
            return { 
                success: false, 
                message: 'Error de conexión con el servidor: ' + error.message
            };
        }
    },
    
    // ============================================
    // EMPLEADOS
    // ============================================
    async obtenerEmpleados() {
        try {
            const response = await fetch(`${this.baseURL}?recurso=Usuarios`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            
            if (!text || text.trim() === '') {
                console.error("❌ La respuesta está vacía");
                return { 
                    success: false, 
                    message: 'Respuesta vacía del servidor',
                    empleados: []
                };
            }
            
            const data = JSON.parse(text);
            
            if (Array.isArray(data)) {
                StateManager.setEmpleados(data);
                console.log("✅ Empleados cargados:", data.length);
                return { success: true, empleados: data };
            } else if (data.success) {
                StateManager.setEmpleados(data.empleados);
                console.log("✅ Empleados cargados:", data.empleados.length);
            } else {
                console.error("❌ Error al obtener empleados:", data.message);
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al obtener empleados:', error);
            return { 
                success: false, 
                message: 'Error de conexión',
                empleados: []
            };
        }
    },
    
    async agregarEmpleado(empleado) {
        try {
            const response = await fetch(`${this.baseURL}?recurso=Usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empleado)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                await this.obtenerEmpleados();
                console.log("✅ Empleado agregado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al agregar empleado:', error);
            return { 
                success: false, 
                message: 'Error de conexión' 
            };
        }
    },
    
    async modificarEmpleado(id, empleado) {
        try {
            const response = await fetch(`${this.baseURL}?recurso=Usuarios`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...empleado,
                    id_usuario: id
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                await this.obtenerEmpleados();
                console.log("✅ Empleado modificado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al modificar empleado:', error);
            return { 
                success: false, 
                message: 'Error de conexión' 
            };
        }
    },
    
    async eliminarEmpleado(id) {
        try {
            const response = await fetch(`${this.baseURL}?recurso=Usuarios`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_usuario: id })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                await this.obtenerEmpleados();
                console.log("✅ Empleado eliminado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al eliminar empleado:', error);
            return { 
                success: false, 
                message: 'Error de conexión' 
            };
        }
    },
    
    // ============================================
    // TURNOS
    // ============================================
    async obtenerTurnos() {
    try {
        console.log('📡 Obteniendo turnos desde:', `${this.baseURL}?recurso=turnos&completo=1:1`);
        
        const response = await fetch(`${this.baseURL}?recurso=turnos&completo=1:1`);            
        console.log('📊 Status de turnos:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        if (!text || text.trim() === '') {
            console.warn("⚠️ Respuesta vacía del servidor");
            return { success: true, turnos: [] };
        }
        
        const data = JSON.parse(text);
        
        // La API devuelve directamente un array de turnos
        if (Array.isArray(data)) {
            console.log("✅ Turnos obtenidos desde API:", data.length);
            // ❌ NO GUARDAR EN STATE AQUÍ - dejar que app.js lo haga después del mapeo
            return { success: true, turnos: data };
        } 
        // O puede devolver un objeto con success
        else if (data.success && Array.isArray(data.turnos)) {
            console.log("✅ Turnos obtenidos desde API:", data.turnos.length);
            // ❌ NO GUARDAR EN STATE AQUÍ - dejar que app.js lo haga después del mapeo
            return { success: true, turnos: data.turnos };
        }
        // Si hay un error del servidor
        else if (data.error || !data.success) {
            console.error('❌ Error del servidor:', data.msg || data.error);
            return { success: false, msg: data.msg || data.error, turnos: [] };
        }
        
        // Caso por defecto
        console.warn('⚠️ Formato de respuesta inesperado:', data);
        return { success: false, turnos: [] };
        
    } catch (error) {
        console.error('❌ Error al obtener turnos:', error);
        return { 
            success: false, 
            message: 'Error de conexión: ' + error.message,
            turnos: []
        };
    }
},

    async crearTurno(turno) {
        try {
            console.log('📤 Creando turno:', turno);
            
            const response = await fetch(`${this.baseURL}?recurso=turnos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turno)
            });
            
            console.log('📊 Status de creación:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error del servidor:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📥 Respuesta de creación:', data);
            
            if (data.success) {
                // Recargar lista de turnos
                await this.obtenerTurnos();
                console.log("✅ Turno creado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al crear turno:', error);
            return { 
                success: false, 
                msg: 'Error de conexión: ' + error.message
            };
        }
    },

    async modificarTurno(turno) {
        try {
            const response = await fetch(`${this.baseURL}?recurso=turnos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turno)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                await this.obtenerTurnos();
                console.log("✅ Turno modificado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al modificar turno:', error);
            return { 
                success: false, 
                msg: 'Error de conexión' 
            };
        }
    },

    async eliminarTurno(id_turno) {
        try {
            const response = await fetch(`${this.baseURL}?recurso=turnos`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_turno })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                await this.obtenerTurnos();
                console.log("✅ Turno eliminado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al eliminar turno:', error);
            return { 
                success: false, 
                msg: 'Error de conexión' 
            };
        }
    },

    async aceptarTurno(id_turno, id_empleado, rol) {
    try {
        console.log('✅ Aceptando turno:', { id_turno, id_empleado, rol });
        
        const response = await fetch(`${this.baseURL}?recurso=turnos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accion: 'aceptar',  // 🔑 Clave para diferenciar de modificar
                id_turno: id_turno,
                id_empleado: id_empleado,
                rol: rol
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            await this.obtenerTurnos();
            console.log("✅ Turno aceptado correctamente");
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Error al aceptar turno:', error);
        return { 
            success: false, 
            msg: 'Error de conexión: ' + error.message
        };
    }
},

    // ============================================
    // AVISOS
    // ============================================
    async obtenerAvisos() {
        try {
            const response = await fetch('api/Controladores/avisos.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const avisos = await response.json();
            
            if (Array.isArray(avisos)) {
                console.log("✅ Avisos cargados:", avisos.length);
                return { success: true, avisos };
            }
            
            return { success: false, avisos: [] };
            
        } catch (error) {
            console.error('❌ Error al obtener avisos:', error);
            return { 
                success: false, 
                message: 'Error de conexión',
                avisos: []
            };
        }
    },

    async crearAviso(aviso) {
        try {
            const response = await fetch('api/Controladores/avisos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aviso)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log("✅ Aviso creado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al crear aviso:', error);
            return { 
                success: false, 
                message: 'Error de conexión' 
            };
        }
    },

    async eliminarAviso(id) {
        try {
            const response = await fetch(`api/Controladores/avisos.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log("✅ Aviso eliminado correctamente");
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al eliminar aviso:', error);
            return { 
                success: false, 
                message: 'Error de conexión' 
            };
        }
    },

    // ============================================
    // CLIENTES
    // ============================================
    async obtenerClientes() {
        try {
            const res = await fetch(`${this.baseURL}?recurso=clientes`);
            const clientes = await res.json();
            
            if (Array.isArray(clientes)) {
                StateManager.setClientes(clientes);
                console.log("✅ Clientes cargados:", clientes.length);
                return { success: true, clientes };
            }
            
            return { error: "Error al obtener clientes" };
        } catch (error) {
            console.error('❌ Error al obtener clientes:', error);
            return { error: "Error de conexión al obtener clientes" };
        }
    },

    async crearCliente(cliente) {
        try {
            const res = await fetch(`${this.baseURL}?recurso=clientes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });

            const data = await res.json();
            
            if (data.success) {
                await this.obtenerClientes();
            }
            
            return data;
        } catch (error) {
            return { error: "Error de conexión al crear cliente" };
        }
    },

    async actualizarTelefono(id_cliente, Telefono) {
        try {
            const res = await fetch(`${this.baseURL}?recurso=clientes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_cliente, Telefono })
            });

            return await res.json();
        } catch (error) {
            return { error: "Error al actualizar teléfono" };
        }
    },

    async eliminarCliente(id_cliente) {
        try {
            const res = await fetch(`${this.baseURL}?recurso=clientes`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_cliente })
            });

            return await res.json();
        } catch (error) {
            return { error: "Error al eliminar cliente" };
        }
    },

    // ============================================
    // SERVICIOS
    // ============================================
    async obtenerServicios() {
        try {
            const response = await fetch('api/Controladores/servicios.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.ok && Array.isArray(data.data)) {
                console.log("✅ Servicios cargados:", data.data.length);
                StateManager.setServicios(data.data);
                return { success: true, servicios: data.data };
            }
            
            return { success: false, servicios: [] };
            
        } catch (error) {
            console.error('❌ Error al obtener servicios:', error);
            return { 
                success: false, 
                message: 'Error de conexión',
                servicios: []
            };
        }
    },

    async crearServicio(servicio) {
        try {
            const response = await fetch('api/Controladores/servicios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicio)
            });
            
            const data = await response.json();
            
            if (data.ok) {
                console.log("✅ Servicio creado correctamente");
                await this.obtenerServicios();
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al crear servicio:', error);
            return { 
                ok: false, 
                msg: 'Error de conexión' 
            };
        }
    },

    async modificarServicio(servicio) {
        try {
            const response = await fetch('api/Controladores/servicios.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicio)
            });
            
            const data = await response.json();
            
            if (data.ok) {
                console.log("✅ Servicio modificado correctamente");
                await this.obtenerServicios();
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al modificar servicio:', error);
            return { ok: false, msg: 'Error de conexión' };
        }
    },

    async eliminarServicio(id) {
        try {
            const response = await fetch('api/Controladores/servicios.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_servicio: id })
            });
            
            const data = await response.json();
            
            if (data.ok) {
                console.log("✅ Servicio eliminado correctamente");
                await this.obtenerServicios();
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error al eliminar servicio:', error);
            return { ok: false, msg: 'Error de conexión' };
        }
    }
};

console.log("✅ apiServicios.js cargado");