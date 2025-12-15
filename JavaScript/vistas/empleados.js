// ============================================
// VISTA: EMPLEADOS (versión optimizada)
// ============================================

const Empleados = {

    // ============================================
    // VALIDACIÓN COMPARTIDA
    // ============================================
    validarDatosEmpleado(datos) {
        const { nombre, apellido, usuario_login, password, esNuevo } = datos;
        
        if (!nombre || !apellido || !usuario_login) {
            Utilidades.mostrarNotificacion('⚠️ Todos los campos son obligatorios', 'error');
            return false;
        }
        
        if (esNuevo && !password) {
            Utilidades.mostrarNotificacion('⚠️ La contraseña es obligatoria', 'error');
            return false;
        }
        
        return true;
    },

    render() {
        if (!State.usuarioActual) {
            Router.navegarSeccion('login');
            return;
        }

        Utilidades.transicionContenido(() => {
            if (State.accionActual === "ver") this.renderVer();
            else if (State.accionActual === "agregar") this.renderAgregar();
        });
    },

    renderVer() {
        if (!State.usuarioActual) {
            Router.navegarSeccion('login');
            return;
        }

        let html = `
            <div class="content-header">
                <h2>👥 Administración de Empleados</h2>
                <p>Gestiona el equipo de trabajo - Usuarios del Sistema</p>
            </div>
            
            <div class="table-responsive">
                <table class="table-custom">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaEmpleadosBody"></tbody>
                </table>
            </div>

            <!-- Modal de edición -->
            <div class="modal fade" id="modalEditarEmpleado" tabindex="-1" aria-labelledby="modalEditarEmpleadoLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius:12px;">
                  <div class="modal-header" style="border-bottom:none;">
                    <h5 class="modal-title text-gradient" id="modalEditarEmpleadoLabel">
                        ✏️ Editar Empleado
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                  </div>
                  <div class="modal-body">
                    <form id="formEditarEmpleado">
                      <input type="hidden" id="editIdEmpleado">

                      <div class="mb-3">
                        <label class="form-label">Nombre</label>
                        <input type="text" id="editNombre" class="form-control form-control-custom" maxlength="50" required>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Apellido</label>
                        <input type="text" id="editApellido" class="form-control form-control-custom" maxlength="50" required>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Usuario</label>
                        <input type="text" id="editUsuario" class="form-control form-control-custom" maxlength="30" required>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select id="editRol" class="form-select form-control-custom" required>
                          <option value="administrador">Administrador</option>
                          <option value="empleado">Empleado</option>
                        </select>
                      </div>

                       <div class="mb-3">
                          <label class="form-label">Nueva Contraseña (opcional)</label>
                          <input type="password" id="editPassword" class="form-control form-control-custom" minlength="6" maxlength="30" placeholder="Dejar vacío para no cambiar">
                       </div>

                    </form>
                  </div>
                  <div class="modal-footer" style="border-top:none;">
                    <button type="button" class="btn btn-custom btn-secondary-custom" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-custom btn-primary-custom" id="btnGuardarCambiosEmpleado">
                        Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
        `;

        document.getElementById("mainContent").innerHTML = html;
        this.renderTabla();
    },

    renderTabla() {
        const tbody = document.getElementById("tablaEmpleadosBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (State.empleados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando empleados...</td></tr>';
            return;
        }

        State.empleados.forEach((e, index) => {
            const rolBadge = e.rol === "administrador"
                ? '<span class="badge-custom badge-confirmado"><i class="fas fa-crown"></i> Admin</span>'
                : '<span class="badge-custom badge-pendiente"><i class="fas fa-user"></i> Empleado</span>';

            // 🔒 Verificar si es administrador
            const esAdmin = e.rol === "administrador";
            const esMiUsuario = State.usuarioActual.id_usuario === e.id_usuario;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>#${e.id_usuario}</strong></td>
                <td>${e.nombre}${esMiUsuario ? ' <span class="badge-custom" style="background: #667eea; color: white; font-size: 0.7rem;"><i class="fas fa-user"></i> Tú</span>' : ''}</td>
                <td>${e.apellido}</td>
                <td><code>${e.usuario_login}</code></td>
                <td>${rolBadge}</td>
                <td>
                    ${esAdmin ? `
                        <button class="btn btn-custom btn-sm-custom" 
                                style="background: #f0f0f0; color: #999; cursor: not-allowed;"
                                disabled
                                title="No se puede modificar administradores">
                            <i class="fas fa-lock"></i> Protegido
                        </button>
                        <button class="btn btn-custom btn-sm-custom ms-2" 
                                style="background: #fee; color: #999; cursor: not-allowed;"
                                disabled
                                title="No se puede eliminar administradores">
                            <i class="fas fa-shield-alt"></i> Protegido
                        </button>
                    ` : `
                        <button class="btn btn-custom btn-edit btn-sm-custom" 
                                onclick="Empleados.abrirModalEditar(${index})">
                            <i class="fas fa-edit"></i> Modificar
                        </button>
                        <button class="btn btn-custom btn-delete btn-sm-custom ms-2" 
                                onclick="Empleados.eliminar(${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    `}
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    abrirModalEditar(index) {
        const empleado = State.empleados[index];
        if (!empleado) return;

        // 🔒 PROTECCIÓN: No permitir editar administradores
        if (empleado.rol === "administrador") {
            Utilidades.mostrarNotificacion(
                '🔒 Los administradores están protegidos y no pueden ser modificados',
                'error'
            );
            return;
        }

        document.getElementById("editIdEmpleado").value = empleado.id_usuario;
        document.getElementById("editNombre").value = empleado.nombre;
        document.getElementById("editApellido").value = empleado.apellido;
        document.getElementById("editUsuario").value = empleado.usuario_login;
        document.getElementById("editRol").value = empleado.rol;

        const modal = new bootstrap.Modal(document.getElementById('modalEditarEmpleado'));
        modal.show();

        const btnGuardar = document.getElementById("btnGuardarCambiosEmpleado");
        btnGuardar.onclick = async () => {
            await this.guardarCambios();
            modal.hide();
        };
    },

    async guardarCambios() {
        const id = document.getElementById("editIdEmpleado").value;
        const nombre = document.getElementById("editNombre").value.trim();
        const apellido = document.getElementById("editApellido").value.trim();
        const usuario_login = document.getElementById("editUsuario").value.trim();
        const rol = document.getElementById("editRol").value;
        const password = document.getElementById("editPassword").value.trim();

        // ✅ Usar validación compartida
        if (!this.validarDatosEmpleado({ nombre, apellido, usuario_login, esNuevo: false })) {
            return;
        }

        const empleadoActualizado = { nombre, apellido, usuario_login, rol };

        if (password) {
            empleadoActualizado.password = password;
        }

        const respuesta = await ApiServicios.modificarEmpleado(id, empleadoActualizado);

        if (respuesta && !respuesta.error) {
            await ApiServicios.obtenerEmpleados();
            this.renderTabla();
            Utilidades.mostrarNotificacion("✅ Empleado actualizado correctamente");
        } else {
            Utilidades.mostrarNotificacion("❌ Error al actualizar el empleado", "error");
        }
    },

    async eliminar(index) {
        if (!State.usuarioActual || State.usuarioActual.rol !== "administrador") {
            Utilidades.mostrarNotificacion('🚫 No tienes permisos para eliminar empleados', 'error');
            return;
        }

        const empleado = State.empleados[index];
        if (!empleado) {
            Utilidades.mostrarNotificacion('❌ Error: empleado no encontrado', 'error');
            return;
        }

        // 🔒 PROTECCIÓN 1: No permitir eliminar administradores
        if (empleado.rol === "administrador") {
            Utilidades.mostrarNotificacion(
                '🔒 Los administradores están protegidos y no pueden ser eliminados',
                'error'
            );
            return;
        }

        // 🔒 PROTECCIÓN 2: No permitir eliminar tu propio usuario (redundante pero extra seguridad)
        if (State.usuarioActual.id_usuario === empleado.id_usuario) {
            Utilidades.mostrarNotificacion(
                '🚫 No puedes eliminar tu propio usuario',
                'error'
            );
            return;
        }

        if (!confirm(`¿Seguro que deseas eliminar a ${empleado.nombre} ${empleado.apellido}? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const resultado = await ApiServicios.eliminarEmpleado(empleado.id_usuario);

            if (resultado?.mensaje || resultado?.success) {
                Utilidades.mostrarNotificacion('🗑️ Empleado eliminado correctamente', 'success');
                await ApiServicios.obtenerEmpleados();
                this.renderTabla();
            } else {
                console.error("Error del servidor:", resultado);
                Utilidades.mostrarNotificacion('❌ No se pudo eliminar el empleado', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            Utilidades.mostrarNotificacion('⚠️ Error de conexión con el servidor', 'error');
        }
    },

    renderAgregar() {
        if (!State.usuarioActual || State.usuarioActual.rol !== "administrador") {
            Utilidades.mostrarNotificacion('🚫 No tienes permisos para agregar empleados', 'error');
            Router.navegarAccion('ver');
            return;
        }

        const html = `
        <div class="content-header">
            <h2>➕ Agregar Nuevo Empleado</h2>
            <p>Completa los datos del nuevo empleado</p>
        </div>

        <div class="form-container">
            <form id="formAgregarEmpleado" class="form-custom" onsubmit="Empleados.guardarNuevo(event)">
                
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" id="nuevoNombre" class="form-control form-control-custom" maxlength="50" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Apellido</label>
                    <input type="text" id="nuevoApellido" class="form-control form-control-custom" maxlength="50" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Usuario</label>
                    <input type="text" id="nuevoUsuario" class="form-control form-control-custom" maxlength="30" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Contraseña</label>
                    <input type="password" id="nuevoPassword" class="form-control form-control-custom" minlength="6" maxlength="30" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Rol</label>
                    <select id="nuevoRol" class="form-select form-control-custom" required>
                        <option value="empleado">Empleado</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>

                <div class="d-flex justify-content-end gap-3">
                    <button type="button" class="btn btn-custom btn-secondary-custom" onclick="Router.navegarAccion('ver')">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-custom btn-primary-custom">
                        <i class="fas fa-save"></i> Guardar Empleado
                    </button>
                </div>
            </form>
        </div>
    `;

        document.getElementById("mainContent").innerHTML = html;
    },

    async guardarNuevo(event) {
        event.preventDefault();

        const nombre = document.getElementById("nuevoNombre").value.trim();
        const apellido = document.getElementById("nuevoApellido").value.trim();
        const usuario_login = document.getElementById("nuevoUsuario").value.trim();
        const contraseña = document.getElementById("nuevoPassword").value.trim();
        const rol = document.getElementById("nuevoRol").value;

        // ✅ Usar validación compartida
        if (!this.validarDatosEmpleado({ nombre, apellido, usuario_login, password: contraseña, esNuevo: true })) {
            return;
        }

        const nuevoEmpleado = { nombre, apellido, usuario_login, password: contraseña, rol };

        try {
            const respuesta = await ApiServicios.agregarEmpleado(nuevoEmpleado);

            if (respuesta?.mensaje || respuesta?.success) {
                Utilidades.mostrarNotificacion('✅ Empleado agregado correctamente');
                await ApiServicios.obtenerEmpleados();
                Router.navegarAccion('ver');
            } else {
                console.error("Error del servidor:", respuesta);
                Utilidades.mostrarNotificacion('❌ No se pudo agregar el empleado', 'error');
            }
        } catch (error) {
            console.error("Error al agregar empleado:", error);
            Utilidades.mostrarNotificacion('⚠️ Error de conexión con el servidor', 'error');
        }
    }
};