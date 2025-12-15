// MÓDULO: CLIENTES (Integrado en Turnos)

const ClientesModal = {
    
    // Cargar clientes en el selector del formulario de turnos
    async cargarEnSelector() {
        const select = document.getElementById("clienteSelect");
        if (!select) return;
        
        // Los clientes ya están en State.clientes, solo actualizar el select
        select.innerHTML = '<option value="">Seleccionar cliente...</option>';
        
        State.clientes.forEach(cliente => {
            const option = document.createElement("option");
            option.value = cliente.id_cliente;
            option.setAttribute('data-telefono', cliente.Telefono || '');
            option.textContent = `${cliente.Nombre} ${cliente.Apellido} - ${cliente.Telefono || 'Sin tel.'}`;
            select.appendChild(option);
        });
        
        // Evento para autocompletar teléfono al seleccionar
        select.addEventListener("change", (e) => {
            const telefonoInput = document.getElementById("telefono");
            
            if (e.target.value) {
                const option = e.target.selectedOptions[0];
                const telefono = option.getAttribute('data-telefono');
                if (telefonoInput) telefonoInput.value = telefono || '';
            } else {
                if (telefonoInput) telefonoInput.value = "";
            }
        });
    },
    
    crearModal() {
        
        if (document.getElementById("modalNuevoCliente")) return;
        
        const modalHTML = `
            <div class="modal fade" id="modalNuevoCliente" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content" style="background: white; border-radius: 15px;">
                        <div class="modal-header" style="border-bottom: 2px solid #e9ecef;">
                            <h5 class="modal-title">
                                <i class="fas fa-user-plus"></i> Registrar Nuevo Cliente
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formNuevoCliente">
                                <div class="mb-3">
                                    <label class="form-label-custom">
                                        <i class="fas fa-user"></i> Nombre
                                    </label>
                                    <input type="text" class="form-control form-control-custom" 
                                           id="modalNombre" placeholder="Ej: María" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label-custom">
                                        <i class="fas fa-user"></i> Apellido
                                    </label>
                                    <input type="text" class="form-control form-control-custom" 
                                           id="modalApellido" placeholder="Ej: García" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label-custom">
                                        <i class="fas fa-phone"></i> Teléfono
                                    </label>
                                    <input type="tel" class="form-control form-control-custom" 
                                           id="modalTelefono" placeholder="Ej: 381456789" required>
                                    <small class="text-muted">
                                        <i class="fas fa-info-circle"></i> 6-15 dígitos, sin espacios ni guiones
                                    </small>
                                </div>
                                
                                <div class="d-flex gap-2">
                                    <button type="submit" class="btn btn-custom btn-primary-custom flex-grow-1">
                                        <i class="fas fa-save"></i> Guardar Cliente
                                    </button>
                                    <button type="button" class="btn btn-custom btn-delete" 
                                            data-bs-dismiss="modal">
                                        <i class="fas fa-times"></i> Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalForm();
    },
    
    // Configurar el formulario del modal
    setupModalForm() {
        const form = document.getElementById("formNuevoCliente");
        if (!form) return;
        
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById("modalNombre").value.trim();
            const apellido = document.getElementById("modalApellido").value.trim();
            const telefono = document.getElementById("modalTelefono").value.trim();
            
            // ============================================
            // VALIDACIONES FRONTEND
            // ============================================
            
            // Validar nombre
            if (!Utilidades.validarNombre(nombre)) {
                Utilidades.mostrarNotificacion(
                    "❌ El nombre solo puede contener letras y espacios", 
                    "error"
                );
                document.getElementById("modalNombre").focus();
                return;
            }
            
            // Validar apellido
            if (!Utilidades.validarNombre(apellido)) {
                Utilidades.mostrarNotificacion(
                    "❌ El apellido solo puede contener letras y espacios", 
                    "error"
                );
                document.getElementById("modalApellido").focus();
                return;
            }
            
            // Validar teléfono
            if (!Utilidades.validarTelefono(telefono)) {
                Utilidades.mostrarNotificacion(
                    "❌ Teléfono inválido (debe tener entre 6 y 15 dígitos)", 
                    "error"
                );
                document.getElementById("modalTelefono").focus();
                return;
            }
            
            // Verificar si ya existe un cliente con ese teléfono
            const existe = State.clientes.some(c => c.Telefono === telefono);
            
            if (existe) {
                Utilidades.mostrarNotificacion(
                    "❌ Ya existe un cliente registrado con ese teléfono", 
                    "error"
                );
                document.getElementById("modalTelefono").focus();
                return;
            }
            
            // ENVIAR AL SERVIDOR
            
            const nuevoCliente = {
                Nombre: nombre,
                Apellido: apellido,
                Telefono: telefono
            };
            
            const resultado = await ApiServicios.crearCliente(nuevoCliente);
            
            if (resultado.error) {
                Utilidades.mostrarNotificacion(`❌ ${resultado.error}`, "error");
            } else if (resultado.success) {
                Utilidades.mostrarNotificacion(
                    "✅ Cliente registrado exitosamente", 
                    "success"
                );
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevoCliente"));
                modal.hide();
                
                form.reset();
                
                // Recargar clientes y selector
                await window.cargarClientes();
                await this.cargarEnSelector();
                
                // Autoseleccionar el nuevo cliente
                const select = document.getElementById("clienteSelect");
                const ultimoCliente = State.clientes[State.clientes.length - 1];
                if (ultimoCliente) {
                    select.value = ultimoCliente.id_cliente;
                    select.dispatchEvent(new Event('change'));
                }
            }
        });
    }
};

console.log("✅ clientesModal.js cargado");