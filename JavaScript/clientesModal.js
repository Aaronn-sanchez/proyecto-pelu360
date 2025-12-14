// // ============================================
// // MÓDULO: CLIENTES (Integrado en Turnos)
// // ============================================

// const ClientesModal = {
    
//     // Cargar clientes en el selector del formulario de turnos
//     async cargarEnSelector() {
//         const select = document.getElementById("clienteSelect");
//         if (!select) return;
        
//         const resultado = await ApiServicios.obtenerClientes();
        
//         select.innerHTML = '<option value="">Seleccionar cliente...</option>';
        
//         if (Array.isArray(resultado)) {
//             resultado.forEach(cliente => {
//                 const option = document.createElement("option");
//                 option.value = JSON.stringify({
//                     nombre: cliente.Nombre,
//                     apellido: cliente.Apellido,
//                     telefono: cliente.Telefono
//                 });
//                 option.textContent = `${cliente.Nombre} ${cliente.Apellido} - ${cliente.Telefono}`;
//                 select.appendChild(option);
//             });
//         }
        
//         // Evento para autocompletar teléfono al seleccionar
//         select.addEventListener("change", (e) => {
//             const telefonoInput = document.getElementById("telefono");
//             const nombreInput = document.getElementById("clienteNombre");
//             const apellidoInput = document.getElementById("clienteApellido");
            
//             if (e.target.value) {
//                 const clienteData = JSON.parse(e.target.value);
//                 if (telefonoInput) telefonoInput.value = clienteData.telefono;
//                 if (nombreInput) nombreInput.value = clienteData.nombre;
//                 if (apellidoInput) apellidoInput.value = clienteData.apellido;
//             } else {
//                 if (telefonoInput) telefonoInput.value = "";
//                 if (nombreInput) nombreInput.value = "";
//                 if (apellidoInput) apellidoInput.value = "";
//             }
//         });
//     },
    
//     // Crear el modal en el DOM
//     crearModal() {
//         // Verificar si ya existe
//         if (document.getElementById("modalNuevoCliente")) return;
        
//         const modalHTML = `
//             <div class="modal fade" id="modalNuevoCliente" tabindex="-1">
//                 <div class="modal-dialog">
//                     <div class="modal-content" style="background: white; border-radius: 15px;">
//                         <div class="modal-header" style="border-bottom: 2px solid #e9ecef;">
//                             <h5 class="modal-title">
//                                 <i class="fas fa-user-plus"></i> Registrar Nuevo Cliente
//                             </h5>
//                             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
//                         </div>
//                         <div class="modal-body">
//                             <form id="formNuevoCliente">
//                                 <div class="mb-3">
//                                     <label class="form-label-custom">
//                                         <i class="fas fa-user"></i> Nombre
//                                     </label>
//                                     <input type="text" class="form-control form-control-custom" 
//                                            id="modalNombre" placeholder="Ej: María" required>
//                                 </div>
                                
//                                 <div class="mb-3">
//                                     <label class="form-label-custom">
//                                         <i class="fas fa-user"></i> Apellido
//                                     </label>
//                                     <input type="text" class="form-control form-control-custom" 
//                                            id="modalApellido" placeholder="Ej: García" required>
//                                 </div>
                                
//                                 <div class="mb-3">
//                                     <label class="form-label-custom">
//                                         <i class="fas fa-phone"></i> Teléfono
//                                     </label>
//                                     <input type="tel" class="form-control form-control-custom" 
//                                            id="modalTelefono" placeholder="Ej: 381456789" required>
//                                     <small class="text-muted">
//                                         <i class="fas fa-info-circle"></i> El teléfono debe ser único
//                                     </small>
//                                 </div>
                                
//                                 <div class="d-flex gap-2">
//                                     <button type="submit" class="btn btn-custom btn-primary-custom flex-grow-1">
//                                         <i class="fas fa-save"></i> Guardar Cliente
//                                     </button>
//                                     <button type="button" class="btn btn-custom btn-delete" 
//                                             data-bs-dismiss="modal">
//                                         <i class="fas fa-times"></i> Cancelar
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
        
//         document.body.insertAdjacentHTML('beforeend', modalHTML);
//         this.setupModalForm();
//     },
    
//     // Configurar el formulario del modal
//     setupModalForm() {
//         const form = document.getElementById("formNuevoCliente");
//         if (!form) return;
        
//         form.addEventListener("submit", async (e) => {
//             e.preventDefault();
            
//             const nuevoCliente = {
//                 Nombre: document.getElementById("modalNombre").value.trim(),
//                 Apellido: document.getElementById("modalApellido").value.trim(),
//                 Telefono: document.getElementById("modalTelefono").value.trim()
//             };
            
//             const resultado = await ApiServicios.crearCliente(nuevoCliente);
            
//             if (resultado.error) {
//                 Utilidades.mostrarNotificacion(`❌ ${resultado.error}`, "error");
//             } else if (resultado.success) {
//                 Utilidades.mostrarNotificacion("✅ Cliente registrado exitosamente");
                
//                 // Cerrar modal
//                 const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevoCliente"));
//                 modal.hide();
                
//                 // Limpiar formulario
//                 form.reset();
                
//                 // Recargar selector de clientes
//                 await this.cargarEnSelector();
                
//                 // Autoseleccionar el nuevo cliente
//                 const select = document.getElementById("clienteSelect");
//                 const options = select.options;
//                 for (let i = 0; i < options.length; i++) {
//                     if (options[i].value) {
//                         const clienteData = JSON.parse(options[i].value);
//                         if (clienteData.telefono === nuevoCliente.Telefono) {
//                             select.selectedIndex = i;
//                             select.dispatchEvent(new Event('change'));
//                             break;
//                         }
//                     }
//                 }
//             }
//         });
//     }
// };

// console.log("✅ clientesModal.js cargado");

// ============================================
// MÓDULO: CLIENTES (Integrado en Turnos)
// ============================================

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
    
    // Crear el modal en el DOM
    crearModal() {
        // Verificar si ya existe
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
                                        <i class="fas fa-info-circle"></i> El teléfono debe ser único
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
            
            const nuevoCliente = {
                Nombre: document.getElementById("modalNombre").value.trim(),
                Apellido: document.getElementById("modalApellido").value.trim(),
                Telefono: document.getElementById("modalTelefono").value.trim()
            };
            
            const resultado = await ApiServicios.crearCliente(nuevoCliente);
            
            if (resultado.error) {
                Utilidades.mostrarNotificacion(`❌ ${resultado.error}`, "error");
            } else if (resultado.success) {
                Utilidades.mostrarNotificacion("✅ Cliente registrado exitosamente");
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevoCliente"));
                modal.hide();
                
                // Limpiar formulario
                form.reset();
                
                // Recargar selector de clientes
                await this.cargarEnSelector();
                
                // Autoseleccionar el nuevo cliente (el último agregado)
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